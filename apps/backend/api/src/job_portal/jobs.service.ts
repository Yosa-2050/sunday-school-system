import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { ListStringRequestModel } from '@shega/Utilities/models/list-string.model';
// biome-ignore lint/style/useImportType: <explanation>
import { PaginationDto2 } from '@shega/Utilities/models/paginated.request2';
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { UserDetails } from '@shega/auth/dtos/response/user-response-payload.response.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { DocumentService } from '@shega/document/document.service';
// biome-ignore lint/style/useImportType: <explanation>
import { AddressService } from '@shega/location/address.service';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from '@shega/notification/notification.service';
import { getInAppHtmlTemplate } from '@shega/notification/seeds/templates/inAppHtmlTemplate';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Express } from 'express';
// biome-ignore lint/style/useImportType: <explanation>
import { In, Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import {
    AddEducationalHistoryRequestDto,
    updateEducationalHistoryRequestDto,
} from './dto/request/add-education-history.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import {
    AddExperienceRequestDto,
    UpdateExperienceRequestDto,
} from './dto/request/add-experiance.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { GetJobApplicationsForApplicantRequestDto } from './dto/request/get-job-applications.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { JobApplicationRequestDto } from './dto/request/job-application.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateApplicantRequestDto } from './dto/request/update-applicant.request.dto';
import { ApplicantSkills } from './entities/applicants-skills.entity';
import { Applicants } from './entities/applicants.entity';
import { EducationHistory } from './entities/educational-history.entity';
import { Experiance } from './entities/experience.entity';
import { Applications } from './entities/job-application.entity';
import { Jobs } from './entities/jobs.entity';
import { Programs } from './entities/programs.entity';
import { SavedPrograms } from './entities/savedPrograms.entity';
import { ProgramType } from './enums/program-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';

export class JobsService {
    constructor(
        private readonly documentService: DocumentService,
        private readonly profileService: ProfileService,
        private readonly jobPortalService: JobPortalService,
        @InjectRepository(Applicants)
        private applicantRepo: Repository<Applicants>,
        @InjectRepository(Applications)
        private jobApplicantRepo: Repository<Applications>,
        @InjectRepository(ApplicantSkills)
        private readonly applicantSkillRepo: Repository<ApplicantSkills>,
        @InjectRepository(Experiance)
        private readonly experienceRepo: Repository<Experiance>,
        @InjectRepository(EducationHistory)
        private readonly educationalHistoryRepo: Repository<EducationHistory>,
        private readonly notificationService: NotificationService,
        @InjectRepository(SavedPrograms)
        private savedProgramsRepo: Repository<SavedPrograms>,
        @InjectRepository(Programs)
        private programsRepo: Repository<Programs>,
        private addressService: AddressService,
        @InjectRepository(Jobs)
        private jobRepo: Repository<Jobs>,
    ) {}

    async getApplicantDetail(id: string) {
        const applicant = await this.applicantRepo.findOneBy({
            profile: { id },
        });

        const profile = await this.profileService.findById(id);
        const userDetails = new UserDetails();
        userDetails.applicantId = applicant?.id;
        userDetails.profileId = profile?.id;
        return userDetails;
    }

    async apply(
        programId: string,
        applicantId: string,
        dto: JobApplicationRequestDto,
    ) {
        const applicant = await this.FindApplicantOrThrow(applicantId);
        if (!(await this.GetCanApplyApplicant(applicant))?.canApply) {
            throw new BadRequestException('User can not apply');
        }
        const existingApp = await this.programsRepo.findOneBy({
            id: programId,
            applications: { applicants: { id: applicant.id } },
        });
        if (existingApp) {
            throw new BadRequestException('Already applied for the job');
        }

        const program = await this.programsRepo.findOneBy({ id: programId });

        if (!program) {
            throw new EntityNotFoundException('Program');
        }

        const application = this.jobApplicantRepo.create(dto);
        application.program = program;
        application.applicants = applicant;

        const savedJobApplication = this.jobApplicantRepo.save(application);
        let subjectParagraph = null;
        let contentParagraph = null;
        if (savedJobApplication) {
            const user = await this.profileService.findUserByProfileId(
                applicant.profile.id,
            );
            const programType =
                program.programType === ProgramType.Job
                    ? 'Job'
                    : 'Mentorship program';

            subjectParagraph = 'New Applicant for Your Job Post!';
            contentParagraph = `A new candidate has applied for your ${program.title} position. Review their application and decide your next steps.`;

            const job = await this.jobRepo.findOneBy({
                program: { id: program.id },
            });

            const jobPostedUser = await this.profileService.findUserByProfileId(
                job.postedBy.employee.profile.id,
            );

            this.notificationService.send({
                channel: NotificationChannel.InApp,
                subject: getInAppHtmlTemplate(subjectParagraph),
                content: getInAppHtmlTemplate(contentParagraph),
                to: jobPostedUser.id,
                reference: jobPostedUser.id,
                isRealTimeNotification: true,
                isNotifyToAllUser: false,
            });
        }
        return UtilityServices.SuccessIdResponse();
    }

    private async GetJobTemplate(
        applicant: Applicants,
        program: Programs,
        dateToday: Date,
    ) {
        const job = await this.jobPortalService.findOneJobByProgramId(
            program.id,
        );
        return await this.notificationService.getTemplate(
            'jobApplicationEmailTemplate',
            {
                jobSeekerName: applicant.profile.firstName,
                jobTitle: program.title,
                companyName: job.organization.name,
                applicationDate: dateToday.toLocaleDateString(),
            },
            {
                jobTitle: program.title,
                companyName: job.organization.name,
            },
        );
    }

    private async FindApplicantOrThrow(applicantId: string) {
        const applicant = await this.applicantRepo.findOneBy({
            id: applicantId,
        });
        if (!applicant) {
            throw new EntityNotFoundException('JobApplication');
        }
        return applicant;
    }

    async createApplicant(profileId: string) {
        const profile = await this.profileService.findById(profileId);

        const applicant = this.applicantRepo.create();
        applicant.profile = profile;

        return this.applicantRepo.save(applicant);
    }

    async jobsApplied(
        id: string,
        request: GetJobApplicationsForApplicantRequestDto,
    ) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const where: any = {};

        if (request.status) {
            where.status = request.status;
        }
        where.applicants = { id };

        const [data, count] = await this.jobApplicantRepo.findAndCount({
            where,
            skip: (request.pagination.page - 1) * request.pagination.limit,
            take: request.pagination.limit,
        });
        if (!data) {
            throw new BadRequestException('No applied jobs');
        }
        return new PaginatedResponseDto<Applications[]>(
            data,
            count,
            request.pagination.page,
            request.pagination.limit,
        );
    }

    async jobsAppliedByProgramId(id: string) {
        const existingApp = await this.jobApplicantRepo.findOneBy({
            program: { id },
        });
        if (!existingApp) {
            throw new BadRequestException('No applied jobs');
        }

        return existingApp;
    }

    async updateApplicantDetail(
        applicantId: string,
        dto: UpdateApplicantRequestDto,
    ) {
        await this.FindApplicantOrThrow(applicantId);

        const updated = await this.applicantRepo.update(
            { id: applicantId },
            {
                bio: dto.bio,
                coverLetter: dto.coverLetter,
                headline: dto.headline,
            }, //CV from file upload
        );

        return UtilityServices.EnsureUpdated(updated, applicantId);
    }

    async addSkills(applicantId: string, dto: ListStringRequestModel) {
        const applicant = await this.FindApplicantOrThrow(applicantId);

        const allSkills = await this.applicantSkillRepo.findBy({
            applicant: { id: applicantId },
        });

        const existingSkills = new Set(allSkills?.map((s) => s.skill));
        const newSkills = new Set(dto.list || []);

        // Compute differences
        const skillsToRemove = [...existingSkills].filter(
            (s) => !newSkills.has(s),
        );
        const skillsToAdd = [...newSkills].filter(
            (s) => !existingSkills.has(s),
        );

        // Perform updates
        await Promise.all([
            skillsToRemove.length &&
                this.applicantSkillRepo.delete({
                    applicant: { id: applicantId },
                    skill: In(skillsToRemove),
                }),
            skillsToAdd.length &&
                this.applicantSkillRepo.insert(
                    skillsToAdd.map((skill) => ({ skill, applicant })),
                ),
        ]);
        return UtilityServices.SuccessIdResponse();
    }

    async addExperience(applicantId: string, dto: AddExperienceRequestDto) {
        const applicant = await this.FindApplicantOrThrow(applicantId);

        const experience = this.experienceRepo.create(dto);
        experience.country = dto.countryId
            ? await this.addressService.findCountryById(dto.countryId)
            : null;
        experience.state = dto.stateId
            ? await this.addressService.findLocationInfoById(dto.stateId)
            : null;
        experience.city = dto.cityId
            ? await this.addressService.findLocationInfoById(dto.cityId)
            : null;
        experience.applicant = applicant;

        return this.experienceRepo.save(experience);
    }

    async addEducationalHistory(
        applicantId: string,
        dto: AddEducationalHistoryRequestDto,
    ) {
        const applicant = await this.FindApplicantOrThrow(applicantId);

        const history = this.educationalHistoryRepo.create(dto);

        const fieldOfStudy = await this.jobPortalService.findCategoryById(
            dto.fieldOfStudyId,
        );

        if (!fieldOfStudy) {
            throw new EntityNotFoundException('Category');
        }

        history.fieldOfStudy = fieldOfStudy;
        history.applicant = applicant;

        return this.educationalHistoryRepo.save(history);
    }

    async updateExperience(
        applicantId: string,
        experienceId: string,
        dto: UpdateExperienceRequestDto,
    ) {
        const applicant = await this.FindApplicantOrThrow(applicantId);

        const existingExperience = await this.experienceRepo.findOneBy({
            applicant: { id: applicantId },
            id: experienceId,
        });

        if (!existingExperience) {
            throw new EntityNotFoundException('Experience');
        }
        const experience = await this.experienceRepo.preload({
            id: experienceId,
            ...dto,
        });

        experience.country = dto.countryId
            ? await this.addressService.findCountryById(dto.countryId)
            : null;
        experience.state = dto.stateId
            ? await this.addressService.findLocationInfoById(dto.stateId)
            : null;
        experience.city = dto.cityId
            ? await this.addressService.findLocationInfoById(dto.cityId)
            : null;

        return this.experienceRepo.save(experience);
    }

    async updateEducationalHistory(
        applicantId: string,
        historyId: string,
        dto: updateEducationalHistoryRequestDto,
    ) {
        const applicant = await this.FindApplicantOrThrow(applicantId);

        const educationHistory = await this.educationalHistoryRepo.findOneBy({
            applicant: { id: applicantId },
            id: historyId,
        });

        if (!educationHistory) {
            throw new EntityNotFoundException('EducationalHistory');
        }

        const fieldOfStudy = await this.jobPortalService.findCategoryById(
            dto.fieldOfStudyId,
        );
        if (!fieldOfStudy) {
            throw new EntityNotFoundException('Category');
        }
        const history = await this.educationalHistoryRepo.preload({
            id: historyId,
            ...dto,
            fieldOfStudy: dto.fieldOfStudyId ? fieldOfStudy : undefined,
        });
        return this.educationalHistoryRepo.save(history);
    }

    async deleteExperience(applicantId: string, experienceId: string) {
        const applicant = await this.FindApplicantOrThrow(applicantId);

        const experience = await this.experienceRepo.findOneBy({
            applicant: { id: applicantId },
            id: experienceId,
        });

        if (!experience) {
            throw new EntityNotFoundException('Experience');
        }
        const deleted = await this.experienceRepo.delete(experience.id);

        return UtilityServices.EnsureDeleted(deleted, experienceId);
    }

    async deleteEducationalHistory(applicantId: string, historyId: string) {
        const applicant = await this.FindApplicantOrThrow(applicantId);

        const history = await this.educationalHistoryRepo.findOneBy({
            applicant: { id: applicantId },
            id: historyId,
        });

        if (!history) {
            throw new EntityNotFoundException('EducationalHistory');
        }

        const deleted = await this.educationalHistoryRepo.delete(history.id);

        return UtilityServices.EnsureDeleted(deleted, historyId);
    }

    async getDetails(applicantId: string) {
        const applicant = await this.applicantRepo.findOne({
            where: { id: applicantId },
            relations: ['experiance', 'educationalHistory', 'skills'],
        });

        if (!applicant) {
            throw new EntityNotFoundException(typeof Applicants);
        }

        return applicant;
    }

    async uploadCv(applicantId: string, file: Express.Multer.File) {
        await this.FindApplicantOrThrow(applicantId);
        const documentId = await this.documentService.create(file, applicantId);

        const updated = await this.applicantRepo.update(
            { id: applicantId },
            { cv: documentId }, //CV from file upload
        );

        return UtilityServices.EnsureUpdated(updated, applicantId);
    }

    async saveProgram(applicantId: string, programId: string) {
        const programSaved = await this.savedProgramsRepo.findOne({
            where: {
                applicant: { id: applicantId },
                program: { id: programId },
            },
        });

        if (programSaved) {
            throw new BadRequestException('ALREADY_PROGRAM_SAVED');
        }
        const applicant = await this.applicantRepo.findOneBy({
            id: applicantId,
        });
        const program = await this.jobPortalService.findOneProgram(programId);
        if (!program) {
            throw new NotFoundException(
                `Program Not Found with ProgramId ${programId}`,
            );
        }
        const savedProgram = this.savedProgramsRepo.create();
        savedProgram.applicant = applicant;
        savedProgram.program = program;

        return this.savedProgramsRepo.save(savedProgram);
    }

    async unsaveProgram(applicantId: string, programId: string) {
        const programSaved = await this.savedProgramsRepo.findOne({
            where: {
                applicant: { id: applicantId },
                program: { id: programId },
            },
        });

        if (!programSaved) {
            throw new NotFoundException(
                `Program not saved with applicantId ${applicantId} and programId ${programId}`,
            );
        }

        const deleted = await this.savedProgramsRepo.delete(programSaved.id);

        return UtilityServices.EnsureDeleted(deleted, programSaved.id);
    }

    async getSavedProgramsByApplicantId(
        applicantId: string,
        paginationDto: PaginationDto2,
    ) {
        const [data, total] = await this.savedProgramsRepo
            .createQueryBuilder('savedPrograms')
            .leftJoinAndSelect('savedPrograms.program', 'program')
            .leftJoinAndSelect('program.country', 'country')
            .leftJoinAndSelect('program.state', 'state')
            .leftJoinAndSelect('program.city', 'city')
            .leftJoin('savedPrograms.applicant', 'applicant')
            .where('savedPrograms.applicantId = :applicantId', { applicantId })
            .orderBy('savedPrograms.createdAt', 'DESC')
            .skip((paginationDto.page - 1) * paginationDto.limit)
            .take(paginationDto.limit)
            .getManyAndCount();

        const programList = data.map((job) => job.program);

        return new PaginatedResponseDto<Programs[]>(
            programList,
            total,
            paginationDto.page,
            paginationDto.limit,
        );
    }

    async checkApplicantStatus(applicantId: string) {
        const applicant = await this.applicantRepo.findOneBy({
            id: applicantId,
        });

        const canApply = await this.GetCanApplyApplicant(applicant);

        const updated = await this.applicantRepo.update(
            { id: applicantId },
            { canApply: canApply.canApply },
        );

        const result = UtilityServices.EnsureUpdated(updated, applicantId);
        if (result.success) {
            return canApply;
        }
    }

    private async GetCanApplyApplicant(applicant: Applicants) {
        let canApply = true;
        const profile = applicant.profile;
        const applyObject = {
            cv: true,
            profilePic: true,
            profile: true,
            education: true,
            experiance: true,
            canApply: true,
        };

        if (!applicant.cv) {
            canApply = false;
            applyObject.cv = false;
        }

        if (!profile.profile_picture_id) {
            applyObject.profilePic = false;
        }

        if (!(profile.birthDate && profile.gender && profile.phoneNumber)) {
            canApply = false;
            applyObject.profile = false;
        }

        if (!((await applicant.educationalHistory)?.length > 0)) {
            applyObject.education = false;
        }

        if (!((await applicant.experiance)?.length > 0)) {
            applyObject.experiance = false;
        }

        applyObject.canApply = canApply;
        return applyObject;
    }
}

import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { ListStringRequestModel } from '@shega/Utilities/models/list-string.model';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { UserDetails } from '@shega/auth/dtos/response/user-response-payload.reponse.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { DocumentService } from '@shega/document/document.service';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from '@shega/notification/notification.service';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
import { instanceToPlain } from 'class-transformer';
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
    AddExperianceRequestDto,
    UpdateExperianceRequestDto,
} from './dto/request/add-experiance.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateApplicantRequestDto } from './dto/request/update-applicant.request.dto';
import { ApplicantSkills } from './entities/applicants-skills.entity';
import { Applicants } from './entities/applicants.entity';
import { EducationHistory } from './entities/educational-history.entity';
import { Experiance } from './entities/experiance.entity';
import { Applications } from './entities/job-application.entity';
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
        private readonly experianceRepo: Repository<Experiance>,
        @InjectRepository(EducationHistory)
        private readonly educationalHistoryRepo: Repository<EducationHistory>,
        private readonly notificationService: NotificationService,
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

    async apply(programId: string, applicantId: string) {
        const applicant = await this.FindApplicantOrThrow(applicantId);
        const existingApp = await this.jobApplicantRepo.findOneBy({
            program: { id: programId },
            applicants: { id: applicant.id },
        });
        if (existingApp) {
            throw new BadRequestException('Already applied for the job');
        }

        const job = await this.jobPortalService.findJobByProgram(programId);

        const application = this.jobApplicantRepo.create();
        application.program = job.program;
        application.applicants = applicant;

        const savedJobApplication = this.jobApplicantRepo.save(application);
        if (savedJobApplication) {
            //send email
            const dateToday = new Date();
            const jobApplicationEmailTemplate =
                await this.notificationService.getTemplate(
                    'jobApplicationEmailTemplate',
                    {
                        jobSeekerName: applicant.profile.firstName,
                        jobTitle: job.program.title,
                        companyName: job.organization.name,
                        applicationDate: dateToday.toLocaleDateString(),
                    },
                    {
                        jobTitle: job.program.title,
                        companyName: job.organization.name,
                    },
                );

            const user = await this.profileService.findUserByProfileId(
                applicant.profile.id,
            );

            this.notificationService.send({
                channel: NotificationChannel.Email,
                content: jobApplicationEmailTemplate.content,
                to: user.email,
                subject: jobApplicationEmailTemplate.subject,
                reference: user.id,
            });
        }
        return savedJobApplication;
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

    async jobsApplied(id: string) {
        const existingApp = await this.jobApplicantRepo.findBy({
            applicants: { id },
        });
        if (!existingApp) {
            throw new BadRequestException('No applied jobs');
        }

        return instanceToPlain(existingApp, {
            groups: ['internal'], // will include createdAt
        });
    }

    async jobsAppliedByJobId(id: string) {
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
        return UtilityServices.SuccessResponse();
    }

    async addExperiance(applicantId: string, dto: AddExperianceRequestDto) {
        const applicant = await this.FindApplicantOrThrow(applicantId);

        const experiance = this.experianceRepo.create(dto);
        experiance.applicant = applicant;

        return this.experianceRepo.save(experiance);
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

    async updateExperiance(
        applicantId: string,
        experianceId: string,
        dto: UpdateExperianceRequestDto,
    ) {
        const applicant = await this.FindApplicantOrThrow(applicantId);

        const existingExperiance = await applicant.experiance;

        if (!existingExperiance.find((x) => x.id === experianceId)) {
            throw new EntityNotFoundException('Experiance');
        }
        const experiance = await this.experianceRepo.preload({
            id: experianceId,
            ...dto,
        });

        return this.experianceRepo.save(experiance);
    }
    async updateEducationalHistory(
        applicantId: string,
        historyId: string,
        dto: updateEducationalHistoryRequestDto,
    ) {
        const applicant = await this.FindApplicantOrThrow(applicantId);

        const educationHistory = await applicant.educationalHistory;
        if (!educationHistory.find((x) => x.id === historyId)) {
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

    async deleteExperiance(applicantId: string, experianceId: string) {
        const applicant = await this.FindApplicantOrThrow(applicantId);

        const existingExperiance = await applicant.experiance;

        const experiance = existingExperiance.find(
            (x) => x.id === experianceId,
        );
        if (!experiance) {
            throw new EntityNotFoundException('Experiance');
        }
        const deleted = await this.experianceRepo.delete(experiance.id);

        return UtilityServices.EnsureDeleted(deleted, experianceId);
    }
    async deleteEducationalHistory(applicantId: string, historyId: string) {
        const applicant = await this.FindApplicantOrThrow(applicantId);

        const educationHistory = await applicant.educationalHistory;

        const history = educationHistory.find((x) => x.id === historyId);
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
            throw new EntityNotFoundException('Applicant');
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
}

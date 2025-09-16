import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { ListStringRequestModel } from '@shega/Utilities/models/list-string.model';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { UserDetails } from '@shega/auth/dtos/response/user-response-payload.response.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { AddressService } from '@shega/location/address.service';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from '@shega/notification/notification.service';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
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
} from './dto/request/add-experience.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateApplicantRequestDto } from './dto/request/update-applicant.request.dto';
import { EducationHistory } from './entities/educational-history.entity';
import { Experience } from './entities/experience.entity';
import { QualificationSkills } from './entities/qualification-skills.entity';
import { Qualification } from './entities/qualification.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { QualificationService } from './qualification.service';

export class QualificationDetailService {
    constructor(
        private readonly profileService: ProfileService,
        private readonly jobPortalService: QualificationService,
        @InjectRepository(Qualification)
        private applicantRepo: Repository<Qualification>,
        @InjectRepository(QualificationSkills)
        private readonly applicantSkillRepo: Repository<QualificationSkills>,
        @InjectRepository(Experience)
        private readonly experienceRepo: Repository<Experience>,
        @InjectRepository(EducationHistory)
        private readonly educationalHistoryRepo: Repository<EducationHistory>,
        private readonly notificationService: NotificationService,
        private addressService: AddressService,
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

    async updateApplicantDetail(
        applicantId: string,
        dto: UpdateApplicantRequestDto,
    ) {
        await this.FindApplicantOrThrow(applicantId);

        const updated = await this.applicantRepo.update(
            { id: applicantId },
            {}, //CV from file upload
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
            throw new EntityNotFoundException(typeof Qualification);
        }

        const user = await this.profileService.findUserByProfileId(
            applicant.profile.id,
        );

        return { email: user.email, ...applicant };
    }

    // async uploadCv(applicantId: string, file: Express.Multer.File) {
    //     await this.FindApplicantOrThrow(applicantId);
    //     const documentId = await this.documentService.create(file, applicantId);

    //     const updated = await this.applicantRepo.update(
    //         { id: applicantId },
    //         { cv: documentId }, //CV from file upload
    //     );

    //     return UtilityServices.EnsureUpdated(updated, applicantId);
    // }

    async checkApplicantStatus(applicantId: string) {
        const applicant = await this.applicantRepo.findOneBy({
            id: applicantId,
        });

        const canApply = await this.GetCanApplyApplicant(applicant);

        const updated = await this.applicantRepo.update(
            { id: applicantId },
            { save: canApply.canApply },
        );

        const result = UtilityServices.EnsureUpdated(updated, applicantId);
        if (result.success) {
            return canApply;
        }
    }

    private async GetCanApplyApplicant(applicant: Qualification) {
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

        if (!profile.profile_picture_id) {
            applyObject.profilePic = false;
        }

        if (!(profile.birthDate && profile.gender && profile.phoneNumber)) {
            canApply = false;
            applyObject.profile = false;
        }
        const [, historyCount] =
            await this.educationalHistoryRepo.findAndCountBy({
                applicant: { id: applicant.id },
            });
        if (historyCount === 0) {
            applyObject.education = false;
        }

        const [, experienceCount] = await this.experienceRepo.findAndCountBy({
            applicant: { id: applicant.id },
        });
        if (experienceCount === 0) {
            applyObject.experiance = false;
        }

        applyObject.canApply = canApply;
        return applyObject;
    }
}

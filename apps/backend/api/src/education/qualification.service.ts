import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { PasswordService } from '@shega/Utilities/password.service';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
import { NotificationType } from '@shega/notification/enums/notification-type.enum';
import { NotificationService } from '@shega/notification/notification.service';
import { Organization } from '@shega/organization/entities/organization.entity';

import { OrganizationService } from '@shega/organization/services/organization.service';
import { LoginBy } from '@shega/users/enums/login-by.enum';
import { ProfileService } from '@shega/users/profile.service';
import { UsersService } from '@shega/users/users.service';
import { In, Repository } from 'typeorm';
import { GetJobApplicationsRequestDto } from './dto/request/get-job-applications.request.dto';
import { Category } from './entities/category.entity';
import { EducationHistory } from './entities/educational-history.entity';
import { Qualification } from './entities/qualification.entity';
import { Skills } from './entities/skills.entity';
import { ApplicationStatus } from './enums/job-application-status.enum';
// import { ProgramType } from './enums/program-type.enum';

@Injectable()
export class QualificationService {
    constructor(
        private organizationService: OrganizationService,
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
        @InjectRepository(Skills)
        private skillRepo: Repository<Skills>,
        @InjectRepository(Qualification)
        private applicationRepo: Repository<Qualification>,
        @InjectRepository(EducationHistory)
        private educationHistory: Repository<EducationHistory>,
        @InjectRepository(Organization)
        private organizationRepo: Repository<Organization>,
        private readonly passwordService: PasswordService,
        private readonly profileService: ProfileService,
        private readonly notificationService: NotificationService,
        private readonly userService: UsersService,
    ) {}

    private async SendNotificationForJobCreatedToAdmin(jobCreated: any) {
        const user = await this.userService.findOneUser(
            jobCreated.organization.createdBy,
            LoginBy.EMAIL,
        );
        if (jobCreated.program.isPublished) {
            const org = await this.organizationRepo.findOneBy({
                id: jobCreated.organization.id,
            });

            const metaData = {
                programId: jobCreated.program.id,
                jobId: jobCreated.id,
            };

            this.notificationService.send({
                channel: NotificationChannel.InApp,
                subject: 'New Job Posting Awaiting Your Approval!',
                content: `A new job has been submitted by ${org.name} for ${jobCreated.program.title}. Please review and approve this posting to make it visible to job seekers.`,
                to: user.id,
                reference: user.id,
                isRealTimeNotification: true,
                isNotifyToAllUser: false,
                type: NotificationType.Job,
                metaData,
            });
        }
    }

    async getCategoriesByParentId(id: string) {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category) {
            throw new EntityNotFoundException('Category');
        }

        return category.child;
    }

    async createSkills(name: string) {
        const skillExisting = await this.skillRepo.findOneBy({
            name,
            isActive: true,
        });
        if (skillExisting) {
            throw new BadRequestException('Skill found with the name');
        }

        const skill = this.skillRepo.create();
        skill.name = name;

        return this.skillRepo.save(skill);
    }
    async createCategories(name: string) {
        const categoryExisting = await this.categoryRepo.findOneBy({
            name,
            isActive: true,
        });
        if (categoryExisting) {
            throw new BadRequestException('Category found with the name');
        }

        const category = this.categoryRepo.create();
        category.name = name;
        category.isRoot = true;
        category.hasChild = true;
        return this.categoryRepo.save(category);
    }

    async addCategoriesByParentId(id: string, name: string) {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category) {
            throw new EntityNotFoundException('Category');
        }

        const childCategory = this.categoryRepo.create();
        childCategory.name = name;
        childCategory.isRoot = false;
        childCategory.hasChild = false;
        childCategory.parent = category;
        return this.categoryRepo.save(childCategory);
    }

    findSkills() {
        return this.skillRepo.find();
    }
    findCategories() {
        return this.categoryRepo.findBy({ isRoot: true });
    }

    findCategoryById(id: string) {
        return this.categoryRepo.findOneBy({ id });
    }

    async deleteSkills(id: string) {
        const deleted = await this.skillRepo.delete(id);

        return UtilityServices.EnsureDeleted(deleted, id);
    }
    async deleteCategories(id: string) {
        await this.CheckIfCategoryIsInUse(id);

        const deleted = await this.categoryRepo.delete(id);

        return UtilityServices.EnsureDeleted(deleted, id);
    }
    private async CheckIfCategoryIsInUse(id: string) {
        // const isReferencedJOb = await this.jobCategoryRepo.count({
        //     where: { category: { id } },
        // });
        // const isReferencedEdu = await this.educationHistory.count({
        //     where: { fieldOfStudy: { id } },
        // });
        // if (isReferencedJOb > 0 || isReferencedEdu > 0) {
        //     throw new BadRequestException(
        //         'category is in use and cannot be edited or deleted.',
        //     );
        // }
    }

    async updateSkills(id: string, name: string) {
        const update = await this.skillRepo.preload({
            id,
            name,
        });
        if (!update) {
            throw new EntityNotFoundException('Skill');
        }
        return this.skillRepo.save(update);
    }
    async updateCategories(id: string, name: string) {
        await this.CheckIfCategoryIsInUse(id);

        const update = await this.categoryRepo.preload({
            id,
            name,
        });
        if (!update) {
            throw new EntityNotFoundException('Category');
        }
        return this.categoryRepo.save(update);
    }

    private async SentNotificationForShortListing(
        updateResult: { data: string; success: boolean },
        appliedUsers: any[],
        validated: {
            id: string;
            title: string;
            name: string;
            type: string;
        },
        status: ApplicationStatus,
        orgName: string,
    ) {
        if (updateResult.success) {
            const request = new GetJobApplicationsRequestDto();
            request.status = status;
            let subject = null;
            let content = null;
            if (status === ApplicationStatus.REJECTED) {
                subject = `Regarding Your Application for <b>${validated.title}</b>`;
                content = `Thank you for your interest in the <b>${validated.title}</b> position at <b>${orgName}</b>. After careful consideration, we've decided to move forward with other candidates. We appreciate your time and effort.`;
            } else {
                subject = "Congratulations! You're Shortlisted!";
                content = `We're excited to let you know your application for the <b>${validated.title}</b> position at <b>${orgName}</b> has been shortlisted. We'll be in touch soon with more details!`;
            }

            for (let index = 0; index < appliedUsers.length; index++) {
                const applicant = appliedUsers[index];
                const user = await this.profileService.findUserByProfileId(
                    applicant.applicants.profile.id,
                );
                const metaData = {
                    programId: validated.id,
                };

                this.notificationService.send({
                    channel: NotificationChannel.InApp,
                    subject: subject,
                    content: content,
                    to: user.id,
                    reference: user.id,
                    isRealTimeNotification: true,
                    isNotifyToAllUser: false,
                    type: NotificationType.Mentorship,
                    // validated.type === ProgramType.Job
                    //     ? NotificationType.Job
                    //     : NotificationType.Mentorship,
                    metaData,
                });
            }
        }
    }

    getListCategoriesByParentIds(list: string[]) {
        return this.categoryRepo.findBy({ parent: { id: In(list) } });
    }
}

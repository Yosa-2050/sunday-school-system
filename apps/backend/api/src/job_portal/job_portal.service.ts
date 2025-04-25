import {
    BadRequestException,
    Injectable,
    NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';
// biome-ignore lint/style/useImportType: <explanation>
import { PasswordService } from '@shega/Utilities/password.service';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
// biome-ignore lint/style/useImportType: <explanation>
import { AddressService } from '@shega/location/address.service';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from '@shega/notification/notification.service';
// biome-ignore lint/style/useImportType: <explanation>
import { OrganizationService } from '@shega/organization/organization.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateBasicUserDto } from '@shega/users/dto/create-user.dto';
import { UserRoleType, UserRoleValue } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
// biome-ignore lint/style/useImportType: <explanation>
import { QueryBuilderService } from 'shared/query-builder.service';
import { entityParamDeserializer, entityParamSerializer } from 'shared/schema';
// biome-ignore lint/style/useImportType: <explanation>
import { In, Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateJobPortalDto } from './dto/request/create-job_portal.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { GetJobsRequestDto } from './dto/request/get-jobs.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateJobPortalDto } from './dto/request/update-job_portal.dto';
import { JobResponseDto } from './dto/response/jobs.response.dto';
import { Applicants } from './entities/applicants.entity';
import { Category } from './entities/category.entity';
import { JobApplication } from './entities/job-application.entity';
import { JobCategory } from './entities/job-category.entity';
import { JobDescription } from './entities/job-description.entity';
import { JobSkills } from './entities/job-skills.entity';
import { Jobs } from './entities/jobs.entity';
import { Skills } from './entities/skills.entity';

@Injectable()
export class JobPortalService {
    constructor(
        private organizationService: OrganizationService,
        @InjectRepository(JobSkills)
        private jobSkillsRepo: Repository<JobSkills>,
        @InjectRepository(JobCategory)
        private jobCategoryRepo: Repository<JobCategory>,
        @InjectRepository(JobDescription)
        private jobDescriptionRepo: Repository<JobDescription>,
        @InjectRepository(Jobs)
        private jobRepo: Repository<Jobs>,
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
        @InjectRepository(Skills)
        private skillRepo: Repository<Skills>,
        @InjectRepository(Applicants)
        private applicationRepo: Repository<Applicants>,
        @InjectRepository(JobApplication)
        private jobApplicationRepo: Repository<JobApplication>,
        private readonly queryBuilderService: QueryBuilderService,
        private readonly addressService: AddressService,
        private readonly passwordService: PasswordService,
        private readonly profileService: ProfileService,
        private readonly notificationService: NotificationService,
    ) {}

    async createJobSeeker(dto: CreateBasicUserDto) {
        const pwdGenerated = this.passwordService.generatePassword();

        const role = UserRoleType.JobSeeker;

        const user = await this.profileService.createNewUserProfileQDE(
            dto.email,
            role,
            dto.firstName,
            dto.middleName,
            dto.lastName,
            false,
            pwdGenerated,
            true,
        );

        let applicants = this.applicationRepo.create();
        applicants.profile = user;

        applicants = await this.applicationRepo.save(applicants);

        const signupEmailTemplate = await this.notificationService.getTemplate(
            'signupEmailTemplate',
            {
                userName: dto.firstName,
                role: UserRoleValue(role).value,
                email: dto.email,
                tempPassword: pwdGenerated,
                loginUrl: UserRoleValue(role).url,
            },
            null,
        );

        if (applicants?.id) {
            this.notificationService.send({
                channel: NotificationChannel.Email,
                content: signupEmailTemplate.content,
                to: dto.email,
                subject: signupEmailTemplate.subject,
                reference: user.id,
            });
            return user;
        }

        throw new BadRequestException('Unable to create user');
    }

    async create(
        employeeOrgId: string,
        organizationId: string,
        dto: CreateJobPortalDto,
    ) {
        const organization =
            await this.organizationService.getOrganizationById(organizationId);

        if (organization.status !== ApprovalType.Approved) {
            throw new BadRequestException(
                'Organization is not approved, please contact your administrator',
            );
        }

        const employeeOrg = (await organization.employee).find(
            (x) => x.id === employeeOrgId,
        );
        const job = await this.GetJob(dto);
        const skills = this.GetSkills(dto);
        const descriptions = this.GetDescriptions(dto);

        const category = await this.GetCategories(dto);
        if (category?.length > 0) {
            job.jobCategory = category;
        }
        if (skills?.length > 0) {
            job.jobSkills = skills;
        }

        if (descriptions?.length > 0) {
            job.jobDescriptions = descriptions;
        }

        job.postedBy = employeeOrg;
        job.organization = organization;
        job.status = ApprovalType.Waiting_Approval;
        return this.jobRepo.save(job);
    }

    private async GetJob(dto: CreateJobPortalDto) {
        const job = this.jobRepo.create(dto);

        job.country = await this.addressService.findDefaultCountry();
        job.state = dto.stateId
            ? await this.addressService.findLocationInfoById(dto.stateId)
            : null;
        job.city = dto.cityId
            ? await this.addressService.findLocationInfoById(dto.cityId)
            : null;

        return job;
    }

    private GetSkills(dto: CreateJobPortalDto, job: Jobs = null) {
        return dto.skills
            ?.map((skill) => {
                const jobSkill = this.jobSkillsRepo.create();
                jobSkill.skill = skill;
                if (job) {
                    jobSkill.job = job;
                }
                return jobSkill;
            })
            .filter((x) => x);
    }

    private GetDescriptions(dto: CreateJobPortalDto, job: Jobs = null) {
        return dto.jobDescriptions
            ?.map((desc) => {
                const jobDescription = this.jobDescriptionRepo.create();
                jobDescription.description = desc.description;
                jobDescription.type = desc.type;
                if (job) {
                    jobDescription.job = job;
                }
                return jobDescription;
            })
            .filter((x) => x);
    }

    private async GetCategories(dto: CreateJobPortalDto, job: Jobs = null) {
        const categories = await this.categoryRepo.find();

        const category = dto.catagories
            ?.map((category) => {
                const newCatagory = categories.find((x) => x.id === category);
                if (!newCatagory) {
                    return null;
                }
                const jobCategory = this.jobCategoryRepo.create();
                jobCategory.category = newCatagory;
                if (job) {
                    jobCategory.job = job;
                }
                return jobCategory;
            })
            .filter((x) => x);
        return category;
    }

    async filterJobs(filter: GetJobsRequestDto, applicantId: string = null) {
        const query = this.jobRepo.createQueryBuilder('job');
        query.orderBy('job.postedDate', 'DESC');
        query.leftJoinAndSelect('job.organization', 'organization');
        query.andWhere('job.status = :status', {
            status: ApprovalType.Approved,
        });
        query.andWhere('job.isPublished = :isPublished', {
            isPublished: true,
        });

        if (filter.title) {
            query.andWhere('LOWER(job.title) LIKE LOWER(:title)', {
                title: `%${filter.title}%`,
            });
        }

        if (filter.categoryId) {
            query
                .leftJoin('job.jobCategory', 'category')
                .andWhere('category.id = :categoryId', {
                    categoryId: filter.categoryId,
                });
        }

        if (filter.type) {
            query.andWhere('job.type = :employmentType', {
                employmentType: filter.type,
            });
        }

        if (filter.experianceLevel) {
            query.andWhere('job.experianceLevel = :experianceLevel', {
                experianceLevel: filter.experianceLevel,
            });
        }

        if (filter.salaryFrom) {
            query.andWhere('job.salaryFrom >= :salaryFrom', {
                salaryFrom: filter.salaryFrom,
            });
        }

        if (filter.salaryTo) {
            query.andWhere('job.salaryTo <= :salaryTo', {
                salaryTo: filter.salaryTo,
            });
        }

        if (filter.organizationId) {
            query.andWhere('job.organizationId = :organizationId', {
                organizationId: filter.organizationId,
            });
        }

        if (filter.cityId) {
            query.andWhere('job.cityId = :cityId', {
                cityId: filter.cityId,
            });
        }

        let jobsApplied: string[] = null;
        if (applicantId) {
            const appliedJobs = await this.jobsApplied(applicantId);
            jobsApplied = appliedJobs.map((x) => x.job.id);
        }

        const [data, total] = await query
            .skip((filter.pagination.page - 1) * filter.pagination.limit)
            .take(filter.pagination.limit)
            .getManyAndCount();
        const jobsList = data.map(
            (job) => new JobResponseDto(job, jobsApplied),
        );
        return new PaginatedResponseDto<JobResponseDto[]>(
            jobsList,
            total,
            filter.pagination.page,
            filter.pagination.limit,
        );
    }

    async getJobsByStatusPaginated(
        paginationDto: string,
        applicantId: string = null,
        exportList = false,
    ) {
        let { p, pp } = entityParamDeserializer(paginationDto);
        if (exportList) {
            p = 0;
            pp = 0;
        }
        const deserialized = entityParamDeserializer(paginationDto);
        const queryString = entityParamSerializer({
            ...deserialized,
            f: [
                { f: 'isPublished', v: 'true', o: 'eq' },
                ...(deserialized.f ?? []),
            ],
        });

        const joinOptions = [
            {
                relation: 'entity.organization',
                alias: 'organization',
            },
            {
                relation: 'entity.postedBy',
                alias: 'postedBy',
            },
        ];

        const searchableColumns = [
            'entity.title',
            'entity.description',
            'organization.name',
        ];

        const { data: jobs, total } = await this.queryBuilderService.buildQuery(
            this.jobRepo,
            queryString,
            joinOptions,
            searchableColumns,
        );
        let jobsApplied: string[] = null;
        if (applicantId) {
            const appliedJobs = await this.jobsApplied(applicantId);
            jobsApplied = appliedJobs.map((x) => x.job.id);
        }
        const jobsList = jobs.map(
            (job) => new JobResponseDto(job, jobsApplied),
        );
        return new PaginatedResponseDto<JobResponseDto[]>(
            jobsList,
            total,
            p,
            pp,
        );
    }

    async jobsApplied(id: string) {
        const existingApp = await this.jobApplicationRepo.findBy({
            applicants: { id },
        });
        if (!existingApp) {
            throw new BadRequestException('No applied jobs');
        }

        return existingApp;
    }

    async getJobsByStatusAndByOrgPaginated(
        organizationId: string,
        paginationDto: string,
        isOnlyDraft?: boolean,
        isOnlyPublished?: boolean,
    ) {
        const deserialized = entityParamDeserializer(paginationDto);

        const searchableColumns = [
            'jobs.title',
            'jobs.description',
            'organization.name',
        ];

        const queryString = entityParamSerializer({
            ...deserialized,
            f: [
                { f: 'organization.id', v: organizationId, o: 'eq' }, // Uncommented filter
                isOnlyDraft ? { f: 'isPublished', v: 'false', o: 'eq' } : {},
                isOnlyPublished
                    ? {
                          f: 'isPublished',
                          v: isOnlyPublished.toString(),
                          o: 'eq',
                      }
                    : {},
                ...(deserialized.f ?? []),
            ],
        });

        const joinOptions = [
            {
                relation: 'entity.organization',
                alias: 'organization',
            },
            {
                relation: 'entity.postedBy',
                alias: 'postedBy',
            },
        ];

        const { data: jobs, total } = await this.queryBuilderService.buildQuery(
            this.jobRepo,
            queryString,
            joinOptions,
            searchableColumns,
        );

        const jobsList = jobs.map((org) => new JobResponseDto(org));

        return new PaginatedResponseDto<JobResponseDto[]>(
            jobsList,
            total,
            deserialized.p,
            deserialized.pp,
        );
    }

    async getJobsByList(list: string[]) {
        const jobs = await this.jobRepo.find({ where: { id: In(list) } });

        const jobsList = jobs.map((org) => new JobResponseDto(org));

        return jobsList;
    }

    async jobApproval(id: string, status: ApprovalType, note = '') {
        const job = await this.jobRepo.findOneBy({ id });
        if (!job?.isPublished) {
            throw new BadRequestException('Job is not published');
        }
        if (job?.status !== ApprovalType.Waiting_Approval) {
            throw new BadRequestException(
                'Job is not on waiting approval status',
            );
        }
        const updatedJob = await this.jobRepo.update(id, {
            status,
            notes: note,
        });

        const result = UtilityServices.EnsureUpdated(updatedJob, id);
        if (result.sucess === 'true') {
            let emailTemplate = null;

            if (status === ApprovalType.Approved) {
                emailTemplate = await this.notificationService.getTemplate(
                    'jobPostApprovedEmailTemplate',
                    {
                        employerName: job.postedBy.employee.profile.firstName,
                        jobTitle: job.title,
                        organizationName: job.organization.name,
                    },
                    {
                        jobTitle: job.title,
                    },
                );
            }

            if (status === ApprovalType.Declined) {
                emailTemplate = await this.notificationService.getTemplate(
                    'jobPostDeclinedEmailTemplate',
                    {
                        employerName: job.postedBy.employee.profile.firstName,
                        jobTitle: job.title,
                        organizationName: job.organization.name,
                        reasonForDecline: note,
                    },
                    {
                        jobTitle: job.title,
                    },
                );
            }
            const user = await this.profileService.findUserByProfileId(
                job.postedBy.employee.profile.id,
            );

            this.notificationService.send({
                channel: NotificationChannel.Email,
                content: emailTemplate.content,
                to: user.email,
                subject: emailTemplate.subject,
                reference: user.id,
            });
        }

        return result;
    }

    findAll() {
        throw new NotImplementedException();
    }

    findOne(id: string) {
        return this.jobRepo.findOne({
            where: { id },
            relations: ['jobCategory', 'jobSkills', 'jobDescriptions'],
        });
    }

    async update(id: string, dto: UpdateJobPortalDto, organizationId: string) {
        const job = await this.jobRepo.findOneBy({
            id,
            organization: { id: organizationId },
        });

        if (!job) {
            throw new BadRequestException('Job not found');
        }

        const createDto: CreateJobPortalDto = {
            ...dto,
            title: dto.title ?? job.title,
            isPublished: dto.isPublished ?? job.isPublished,
        };
        const updateJob = await this.GetJob(createDto);
        const skills = await this.GetSkills(createDto, job);
        if (skills && skills.length > 0) {
            await this.jobSkillsRepo.delete({ job: { id: id } });
            await this.jobSkillsRepo.save(skills);
        }

        const categories = await this.GetCategories(createDto, job);
        if (categories && categories.length > 0) {
            await this.jobCategoryRepo.delete({ job: { id: id } });
            await this.jobCategoryRepo.save(categories);
        }

        const description = await this.GetDescriptions(createDto, job);
        if (description && description.length > 0) {
            await this.jobDescriptionRepo.delete({ job: { id: id } });
            await this.jobDescriptionRepo.save(description);
        }

        const updated = await this.jobRepo.update(id, updateJob);

        return UtilityServices.EnsureUpdated(updated, id);
    }

    remove(id: number) {
        throw new NotImplementedException();
    }

    async getCategoriesByParentId(id: string) {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category) {
            throw new BadRequestException('Category not found');
        }

        return category.childs;
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
            throw new BadRequestException('Category not found');
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
        const deleted = await this.skillRepo.delete(id);

        return UtilityServices.EnsureDeleted(deleted, id);
    }
    async updateSkills(id: string, name: string) {
        const update = await this.skillRepo.preload({
            id,
            name,
        });
        if (!update) {
            throw new BadRequestException('Skill not found');
        }
        return this.skillRepo.save(update);
    }
    async updateCategories(id: string, name: string) {
        const update = await this.categoryRepo.preload({
            id,
            name,
        });
        if (!update) {
            throw new BadRequestException('Category not found');
        }
        return this.categoryRepo.save(update);
    }
}

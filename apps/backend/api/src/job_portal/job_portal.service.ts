import {
    BadRequestException,
    Injectable,
    NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { ApiResponseDto } from '@shega/Utilities/models/api-response.model';
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';
// biome-ignore lint/style/useImportType: <explanation>
import { PasswordService } from '@shega/Utilities/password.service';
// biome-ignore lint/style/useImportType: <explanation>
import { AddressService } from '@shega/location/address.service';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from '@shega/notification/notification.service';
import { getSignupEmailTemplate } from '@shega/notification/sendEmailTemplates/signupEmailTemplate';
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
import { UpdateJobPortalDto } from './dto/request/update-job_portal.dto';
import { JobResponseDto } from './dto/response/jobs.response.dto';
import { Applicants } from './entities/applicants.entity';
import { Category } from './entities/category.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { JobCategory } from './entities/job-category.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { JobSkills } from './entities/job-skills.entity';
import { Jobs } from './entities/jobs.entity';
import { Skills } from './entities/skills.entity';

@Injectable()
export class JobPortalService {
    constructor(
        private organizationService: OrganizationService,
        @InjectRepository(Jobs)
        private jobSkillsRepo: Repository<JobSkills>,
        @InjectRepository(Jobs)
        private jobCategoryRepo: Repository<JobCategory>,
        @InjectRepository(Jobs)
        private jobRepo: Repository<Jobs>,
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
        @InjectRepository(Skills)
        private skillRepo: Repository<Skills>,
        @InjectRepository(Applicants)
        private applicationRepo: Repository<Applicants>,
        private readonly queryBuilderService: QueryBuilderService,
        private readonly addressService: AddressService,
        private readonly passwordService: PasswordService,
        private readonly profileService: ProfileService,
        private readonly notificationService: NotificationService,
    ) {}

    async createJobSeeker(dto: CreateBasicUserDto) {
        const pwdGenerated = this.passwordService.generatePassword();

        const role = UserRoleType.WorkProvider;

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

        if (applicants?.id) {
            this.notificationService.send({
                channel: NotificationChannel.Email,
                content: getSignupEmailTemplate({
                    userName: dto.firstName,
                    role: UserRoleValue(role).value,
                    email: dto.email,
                    tempPassword: pwdGenerated,
                    loginUrl: UserRoleValue(role).url,
                }),
                to: dto.email,
                subject: 'Welcome to Shega Jobs! Your Account is Created',
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

        const employeeOrg = (await organization.employee).find(
            (x) => x.id === employeeOrgId,
        );
        const job = this.jobRepo.create(dto);
        const skills = dto.skills?.map((skill) => {
            const jobSkill = this.jobSkillsRepo.create();
            jobSkill.skill = skill;
            return jobSkill;
        });

        const categories = await this.categoryRepo.find();

        const category = dto.catagories?.map((category) => {
            const jobSkill = this.jobCategoryRepo.create();
            jobSkill.category = categories.find((x) => x.id === category);
            return jobSkill;
        });
        job.country = await this.addressService.findDefaultCountry();
        job.state = dto.stateId
            ? await this.addressService.findLocationInfoById(dto.stateId)
            : null;
        job.city = dto.cityId
            ? await this.addressService.findLocationInfoById(dto.cityId)
            : null;
        job.jobCategory = category;
        job.jobSkills = skills;
        job.organization = organization;
        job.status = ApprovalType.Waiting_Approval;
        job.postedBy = employeeOrg;
        return this.jobRepo.save(job);
    }

    async getJobsByStatusPaginated(paginationDto: string, exportList = false) {
        let { p, pp } = entityParamDeserializer(paginationDto);

        if (exportList) {
            p = 0;
            pp = 0;
        }

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
            paginationDto,
            joinOptions,
            searchableColumns,
        );
        const jobsList = jobs.map((org) => new JobResponseDto(org));
        return new PaginatedResponseDto<JobResponseDto[]>(
            jobsList,
            total,
            p,
            pp,
        );
    }

    async getJobsByStatusAndByOrgPaginated(
        organizationId: string,
        paginationDto: string,
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
        if (job?.status !== ApprovalType.Waiting_Approval) {
            throw new BadRequestException(
                'Job is not on waiting approval status',
            );
        }
        const updatedJob = await this.jobRepo.update(id, {
            status,
            notes: note,
        });
        if (updatedJob) {
            return new ApiResponseDto(200);
        }
        return new ApiResponseDto(100);
    }

    findAll() {
        throw new NotImplementedException();
    }

    findOne(id: string) {
        return this.jobRepo.findOneBy({ id });
    }

    update(id: number, updateJobPortalDto: UpdateJobPortalDto) {
        throw new NotImplementedException();
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
}

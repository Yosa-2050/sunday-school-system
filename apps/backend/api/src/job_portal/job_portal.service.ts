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
import { AddressService } from '@shega/location/address.service';
// biome-ignore lint/style/useImportType: <explanation>
import { OrganizationService } from '@shega/organization/organization.service';
// biome-ignore lint/style/useImportType: <explanation>
import { QueryBuilderService } from 'shared/query-builder.service';
import { entityParamDeserializer, entityParamSerializer } from 'shared/schema';
// biome-ignore lint/style/useImportType: <explanation>
import { In, Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateJobPortalDto } from './dto/create-job_portal.dto';
import { JobResponseDto } from './dto/response/jobs.response.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateJobPortalDto } from './dto/update-job_portal.dto';
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
        private readonly queryBuilderService: QueryBuilderService,
        private readonly addressService: AddressService,
    ) {}

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

    async getJobsByStatusPaginated(paginationDto: string) {
        const { p, pp } = entityParamDeserializer(paginationDto);

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

    async jobApproval(id: string, status: ApprovalType) {
        const job = await this.jobRepo.findOneBy({ id });
        if (job && job.status === ApprovalType.Waiting_Approval) {
            throw new BadRequestException('Unable to update job');
        }
        const updatedJob = await this.jobRepo.update(id, { status });
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
        const category = await this.categoryRepo.findOneBy({id});
        if(!category) { throw new BadRequestException("Category not found"); }

        return category.childs;
    }

    async createSkills(name: string) {
        const skillExisting = await this.skillRepo.findOneBy({name, isActive: true});
        if(skillExisting) { throw new BadRequestException("Skill found with the name"); }

        const skill = this.skillRepo.create();
        skill.name = name;

        return this.skillRepo.save(skill);
    }
    async createCategories(name: string) {
        const categoryExisting = await this.categoryRepo.findOneBy({name, isActive: true});
        if(categoryExisting) { throw new BadRequestException("Category found with the name"); }

        const category = this.categoryRepo.create();
        category.name = name;
        category.isRoot = true;
        category.hasChild = true;
        return this.categoryRepo.save(category);
    }

    async addCategoriesByParentId(id: string, name: string) {
        const category = await this.categoryRepo.findOneBy({id});
        if(!category) { throw new BadRequestException("Category not found"); }

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
        return this.categoryRepo.findBy({isRoot: true});
    }
}

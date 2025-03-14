import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';
// biome-ignore lint/style/useImportType: <explanation>
import { OrganizationService } from '@shega/organization/organization.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateJobPortalDto } from './dto/create-job_portal.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateJobPortalDto } from './dto/update-job_portal.dto';
import { Jobs } from './entities/jobs.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { QueryBuilderService } from 'shared/query-builder.service';
import { entityParamDeserializer, entityParamSerializer } from 'shared/schema';

@Injectable()
export class JobPortalService {
    constructor(
        private organizationService: OrganizationService,
        @InjectRepository(Jobs)
        private jobRepo: Repository<Jobs>,
        private readonly queryBuilderService: QueryBuilderService,
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
        job.organization = organization;
        job.status = ApprovalType.New;
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

        return new PaginatedResponseDto<Jobs[]>(jobs, total, p, pp);
    }

    async getJobsByStatusAndByOrgPaginated(
        organizationId: string,
        paginationDto: string,
    ) {
        const deserialized = entityParamDeserializer(paginationDto);

        const searchableColumns = [
            'entity.title',
            'entity.description',
            'organization.name',
        ];
        const queryString = entityParamSerializer({
            ...deserialized,
            f: [
                // { f: "organization.id", v: organizationId, o: "eq" }, // Uncommented filter
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

        return new PaginatedResponseDto<Jobs[]>(
            jobs,
            total,
            deserialized.p,
            deserialized.pp,
        );
    }

    approveJob(id: string) {
        return this.jobRepo.update(id, { status: ApprovalType.Approved });
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
}

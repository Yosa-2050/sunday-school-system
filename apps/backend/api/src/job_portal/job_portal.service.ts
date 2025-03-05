import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { PaginationDto } from '@shega/Utilities/models/paginated.request';
// biome-ignore lint/style/useImportType: <explanation>
import { OrganizationService } from '@shega/organization/organization.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateJobPortalDto } from './dto/create-job_portal.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateJobPortalDto } from './dto/update-job_portal.dto';
import { Jobs } from './entities/jobs.entity';
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';

@Injectable()
export class JobPortalService {
    constructor(
        private organizationService: OrganizationService,
        @InjectRepository(Jobs)
        private jobRepo: Repository<Jobs>,
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

    async getJobsByStatusPaginated(
        status: ApprovalType,
        paginationDto: PaginationDto,
    ) {
        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;

        const [jobs, total] = await this.jobRepo.findAndCount({
            where: { status },
            take: limit,
            skip,
        });

        return new PaginatedResponseDto<Jobs[]>(jobs, total, page, limit);
    }

    async getJobsByStatusAndByOrgPaginated(
        organizationId: string,
        status: ApprovalType,
        paginationDto: PaginationDto,
    ) {
        const organization =
            await this.organizationService.findOne(organizationId);
        const { page, limit } = paginationDto;
        const skip = (page - 1) * limit;

        const [jobs, total] = await this.jobRepo.findAndCount({
            where: { status, organization: { id: organizationId } },
            take: limit,
            skip,
        });

        return new PaginatedResponseDto<Jobs[]>(jobs, total, page, limit);
    }

    approveJob(id: string) {
        return this.jobRepo.update(id, { status: ApprovalType.Approved });
    }

    findAll() {
        throw new NotImplementedException();
    }

    findOne(id: number) {
        throw new NotImplementedException();
    }

    update(id: number, updateJobPortalDto: UpdateJobPortalDto) {
        throw new NotImplementedException();
    }

    remove(id: number) {
        throw new NotImplementedException();
    }
}

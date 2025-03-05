import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';
import { Roles } from '@shega/auth/decorators/roles.decorator';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { PaginationDto } from '@shega/Utilities/models/paginated.request';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';

@Roles(UserRoleType.JobSeeker)
@ApiTags('job-seeker')
@Controller('job-seeker')
export class JobSeekerController {
    constructor(private readonly jobPortalService: JobPortalService) {}

    @Roles(UserRoleType.JobSeeker)
    @Post('jobs')
    getAllPending(@Body() dto: PaginationDto) {
        return this.jobPortalService.getJobsByStatusPaginated(
            ApprovalType.Approved,
            dto,
        );
    }
}

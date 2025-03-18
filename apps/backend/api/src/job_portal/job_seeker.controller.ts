import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { Roles } from '@shega/auth/decorators/roles.decorator';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
import { entityParamDeserializer, entityParamSerializer } from 'shared/schema';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';

@Roles(UserRoleType.JobSeeker)
@ApiTags('job-seeker')
@Controller('job-seeker')
export class JobSeekerController {
    constructor(private readonly jobPortalService: JobPortalService) {}

    @Roles(UserRoleType.JobSeeker)
    @Post('jobs')
    getAllPending(@Body() dto: { q: string }) {
        const deserialized = entityParamDeserializer(dto.q);

        const searchableColumns = [];

        const queryString = entityParamSerializer({
            ...deserialized,
            f: [
                { f: 'status', v: ApprovalType.Approved, o: 'eq' },
                ...(deserialized.f ?? []),
            ],
        });
        return this.jobPortalService.getJobsByStatusPaginated(queryString);
    }
}

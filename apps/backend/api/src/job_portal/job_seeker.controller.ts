import {
    Body,
    Controller,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { Roles } from '@shega/auth/decorators/roles.decorator';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
import { entityParamDeserializer, entityParamSerializer } from 'shared/schema';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';
// biome-ignore lint/style/useImportType: <explanation>
import { JobsService } from './jobs.service';
// biome-ignore lint/style/useImportType: <explanation>
import { AddEducationalHistoryRequestDto } from './dto/request/add-education-history.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { AddExperianceRequestDto } from './dto/request/add-experiance.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateApplicantRequestDto } from './dto/request/update-applicant.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ListStringRequestModel } from '@shega/Utilities/models/list-string.model';

@Roles(UserRoleType.JobSeeker)
@ApiTags('job-seeker')
@Controller('job-seeker')
export class JobSeekerController {
    constructor(
        private readonly jobPortalService: JobPortalService,
        private readonly jobsService: JobsService,
    ) {}

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

    @Roles(UserRoleType.JobSeeker)
    @Post('apply/:jobId')
    apply(@Request() req, @Param('jobId', new ParseUUIDPipe()) jobId: string) {
        return this.jobsService.apply(jobId, CurrentUser.getApplicantId(req));
    }

    @Roles(UserRoleType.JobSeeker)
    @Post('jobs/appliedByJobSeeker')
    appliedJobs(@Request() req) {
        return this.jobsService.jobsApplied(CurrentUser.getApplicantId(req));
    }

    @Roles(UserRoleType.JobSeeker)
    @Post('addEducationalHistory')
    addEducationalHistory(
        @Request() req,
        @Body() dto: AddEducationalHistoryRequestDto,
    ) {
        return this.jobsService.jobsApplied(CurrentUser.getApplicantId(req));
    }

    @Roles(UserRoleType.JobSeeker)
    @Post('addEducationalHistory')
    addExperiance(@Request() req, @Body() dto: AddExperianceRequestDto) {
        return this.jobsService.jobsApplied(CurrentUser.getApplicantId(req));
    }

    @Roles(UserRoleType.JobSeeker)
    @Post('addEducationalHistory')
    addSkills(@Request() req, @Body() dto: ListStringRequestModel) {
        return this.jobsService.jobsApplied(CurrentUser.getApplicantId(req));
    }

    @Roles(UserRoleType.JobSeeker)
    @Put('updatedDetail')
    updateDetail(@Request() req, @Body() dto: UpdateApplicantRequestDto) {
        return this.jobsService.jobsApplied(CurrentUser.getApplicantId(req));
    }
}

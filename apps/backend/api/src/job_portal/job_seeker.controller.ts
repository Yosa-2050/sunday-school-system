import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Request,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
// biome-ignore lint/style/useImportType: <explanation>
import { ListStringRequestModel } from '@shega/Utilities/models/list-string.model';
import { Roles } from '@shega/auth/decorators/roles.decorator';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { Express } from 'express';
// import { entityParamDeserializer, entityParamSerializer } from 'shared/schema';
// biome-ignore lint/style/useImportType: <explanation>
import {
    AddEducationalHistoryRequestDto,
    updateEducationalHistoryRequestDto,
} from './dto/request/add-education-history.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import {
    AddExperianceRequestDto,
    UpdateExperianceRequestDto,
} from './dto/request/add-experiance.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateApplicantRequestDto } from './dto/request/update-applicant.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';
// biome-ignore lint/style/useImportType: <explanation>
import { JobsService } from './jobs.service';
// biome-ignore lint/style/useImportType: <explanation>
import { GetJobsRequestDto } from './dto/request/get-jobs.request.dto';

@Roles(UserRoleType.JobSeeker)
@ApiTags('job-seeker')
@Controller('job-seeker')
export class JobSeekerController {
    constructor(
        private readonly jobPortalService: JobPortalService,
        private readonly jobsService: JobsService,
    ) {}

    @Post('upload/cv')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
        return this.jobsService.uploadCv(CurrentUser.getApplicantId(req), file);
    }

    // @Post('jobs')
    // getAllPending(@Body() dto: { q: string }, @Request() req) {
    //     const deserialized = entityParamDeserializer(dto.q);

    //     const searchableColumns = [];

    //     const queryString = entityParamSerializer({
    //         ...deserialized,
    //         f: [
    //             { f: 'status', v: ApprovalType.Approved, o: 'eq' },
    //             ...(deserialized.f ?? []),
    //         ],
    //     });
    //     return this.jobPortalService.getJobsByStatusPaginated(
    //         queryString,
    //         CurrentUser.getApplicantId(req),
    //     );
    // }

    @Post('jobs')
    getAllPending(@Body() dto: GetJobsRequestDto, @Request() req) {
        return this.jobPortalService.filterJobs(
            dto,
            CurrentUser.getApplicantId(req),
        );
    }

    @Post('apply/:jobId')
    apply(@Request() req, @Param('jobId', new ParseUUIDPipe()) jobId: string) {
        return this.jobsService.apply(jobId, CurrentUser.getApplicantId(req));
    }

    @Post('jobs/appliedByJobSeeker')
    appliedJobs(@Request() req) {
        return this.jobsService.jobsApplied(CurrentUser.getApplicantId(req));
    }

    @Post('educationalHistory')
    addEducationalHistory(
        @Request() req,
        @Body() dto: AddEducationalHistoryRequestDto,
    ) {
        return this.jobsService.addEducationalHistory(
            CurrentUser.getApplicantId(req),
            dto,
        );
    }

    @Post('experiance')
    addExperiance(@Request() req, @Body() dto: AddExperianceRequestDto) {
        return this.jobsService.addExperiance(
            CurrentUser.getApplicantId(req),
            dto,
        );
    }

    @Post('skills')
    addSkills(@Request() req, @Body() dto: ListStringRequestModel) {
        return this.jobsService.addSkills(CurrentUser.getApplicantId(req), dto);
    }

    @Patch('educationalHistory/:id')
    updateEducationalHistory(
        @Request() req,
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: updateEducationalHistoryRequestDto,
    ) {
        return this.jobsService.updateEducationalHistory(
            CurrentUser.getApplicantId(req),
            id,
            dto,
        );
    }

    @Patch('experiance/:id')
    updateExperiance(
        @Request() req,
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateExperianceRequestDto,
    ) {
        return this.jobsService.updateExperiance(
            CurrentUser.getApplicantId(req),
            id,
            dto,
        );
    }

    @Delete('educationalHistory/:historyId')
    deleteEducationalHistory(
        @Request() req,
        @Param('historyId', new ParseUUIDPipe()) historyId: string,
    ) {
        return this.jobsService.deleteEducationalHistory(
            CurrentUser.getApplicantId(req),
            historyId,
        );
    }

    @Delete('experiance/:experianceId')
    deleteExperiance(
        @Request() req,
        @Param('experianceId', new ParseUUIDPipe()) experianceId: string,
    ) {
        return this.jobsService.deleteExperiance(
            CurrentUser.getApplicantId(req),
            experianceId,
        );
    }

    @Patch('detail')
    updateDetail(@Request() req, @Body() dto: UpdateApplicantRequestDto) {
        return this.jobsService.updateApplicantDetail(
            CurrentUser.getApplicantId(req),
            dto,
        );
    }

    @Get('details')
    getDetails(@Request() req) {
        return this.jobsService.getDetails(CurrentUser.getApplicantId(req));
    }
}

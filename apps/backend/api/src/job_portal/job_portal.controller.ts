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
    Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import {
    ExportWithQueryRequestModel,
    ListStringRequestModel,
    StringRequestModel,
} from '@shega/Utilities/models/list-string.model';
import { Roles } from '@shega/auth/decorators/roles.decorator';
// biome-ignore lint/style/useImportType: <explanation>
import { DocumentService } from '@shega/document/document.service';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { Response } from 'express';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateJobPortalDto } from './dto/request/create-job_portal.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { GetJobApplicationsRequestDto } from './dto/request/get-job-applications.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateJobPortalDto } from './dto/request/update-job_portal.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';
// biome-ignore lint/style/useImportType: <explanation>
import { JobsService } from './jobs.service';

@ApiTags('job-portal')
@Controller('job-portal')
export class JobPortalController {
    constructor(
        private readonly jobPortalService: JobPortalService,
        private readonly jobService: JobsService,
        private readonly documentService: DocumentService,
    ) {}

    @Roles(UserRoleType.WorkProvider)
    @Post()
    create(@Request() req, @Body() dto: CreateJobPortalDto) {
        return this.jobPortalService.create(
            CurrentUser.getEmployeeOrgId(req),
            CurrentUser.getOrganizationId(req),
            dto,
        );
    }

    @Roles(UserRoleType.Administrator, UserRoleType.SuperAdmin)
    @Post('jobsByStatus')
    getAllByStatus(@Body() dto: { q: string }) {
        return this.jobPortalService.getJobsByStatusPaginated(dto.q);
    }

    @Roles(UserRoleType.Administrator, UserRoleType.SuperAdmin)
    @Post('jobsByStatus/export')
    async exportByStatus(@Res() res: Response, @Body() dto: { q: string }) {
        const data = await this.jobPortalService.getJobsByStatusPaginated(
            dto.q,
            null,
            true,
        );
        this.documentService.generateCsv(data.data, res, 'jobList');
    }

    @Roles(UserRoleType.Administrator, UserRoleType.SuperAdmin)
    @Post('jobsByStatus/exportSelected')
    async exportSelected(
        @Res() res: Response,
        @Body() dto: ExportWithQueryRequestModel,
    ) {
        let data = [];

        if (dto.list?.length > 0) {
            data = await this.jobPortalService.getJobsByList(dto.list);
        } else {
            data = (
                await this.jobPortalService.getJobsByStatusPaginated(
                    dto.q,
                    null,
                    true,
                )
            ).data;
        }

        this.documentService.generateCsv(data, res, 'jobList');
    }

    @Roles(UserRoleType.WorkProvider)
    @Post('byProvider')
    getAllPostedJobsByProvider(@Request() req, @Body() dto: { q: string }) {
        return this.jobPortalService.getJobsByStatusAndByOrgPaginated(
            CurrentUser.getOrganizationId(req),
            dto.q,
            null,
            true,
        );
    }

    @Roles(UserRoleType.WorkProvider)
    @Post('byProvider/draft')
    getAllDraftJobsByProvider(@Request() req, @Body() dto: { q: string }) {
        return this.jobPortalService.getJobsByStatusAndByOrgPaginated(
            CurrentUser.getOrganizationId(req),
            dto.q,
            true,
        );
    }

    @Roles(UserRoleType.Administrator, UserRoleType.SuperAdmin)
    @Patch('approve/:id')
    approveJob(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.jobPortalService.programApproval(id, ApprovalType.Approved);
    }

    @Roles(UserRoleType.Administrator, UserRoleType.SuperAdmin)
    @Patch('decline/:id')
    declineJob(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: StringRequestModel,
    ) {
        return this.jobPortalService.programApproval(
            id,
            ApprovalType.Declined,
            dto?.note,
        );
    }

    @Roles(UserRoleType.WorkProvider, UserRoleType.Mentor)
    @Post('applications/:programId')
    findAppliedPrograms(
        @Request() req,
        @Param('programId', new ParseUUIDPipe()) id: string,
        @Body() request: GetJobApplicationsRequestDto,
    ) {
        return this.jobPortalService.applicationsByProgramId(id, request);
    }

    @Roles(UserRoleType.WorkProvider, UserRoleType.Mentor)
    @Get('applicant/:applicantId')
    getApplicantDetails(@Param('applicantId') applicantId: string) {
        return this.jobService.getDetails(applicantId);
    }

    @Roles(UserRoleType.WorkProvider, UserRoleType.Mentor)
    @Post('shortList/:programId')
    shortlistApplicants(
        @Request() req,
        @Param('programId', new ParseUUIDPipe()) id: string,
        @Body() request: ListStringRequestModel,
    ) {
        return this.jobPortalService.shortlistApplicants(
            id,
            request.list,
            CurrentUser.getOrganizationId(req, false),
            CurrentUser.getMentorId(req, false),
        );
    }

    @Roles(UserRoleType.WorkProvider, UserRoleType.Mentor)
    @Patch('rejectNotShortList/:programId')
    rejectNotShortlisted(
        @Request() req,
        @Param('programId', new ParseUUIDPipe()) id: string,
    ) {
        return this.jobPortalService.rejectNotShortlisted(
            id,
            CurrentUser.getOrganizationId(req, false),
            CurrentUser.getMentorId(req, false),
        );
    }

    @Roles(UserRoleType.WorkProvider)
    @Patch('closeProgram/:id')
    closeProgram(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
        return this.jobPortalService.openCloseProgram(
            id,
            CurrentUser.getOrganizationId(req, false),
            CurrentUser.getMentorId(req, false),
            true,
        );
    }

    @Roles(UserRoleType.WorkProvider)
    @Patch('openProgram/:id')
    openProgram(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
        return this.jobPortalService.openCloseProgram(
            id,
            CurrentUser.getOrganizationId(req, false),
            CurrentUser.getMentorId(req, false),
            false,
        );
    }

    @Get(':id')
    findJobById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.jobPortalService.findOneByJobId(id);
    }

    @Roles(UserRoleType.WorkProvider)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateJobPortalDto: UpdateJobPortalDto,
        @Request() req,
    ) {
        return this.jobPortalService.update(
            id,
            updateJobPortalDto,
            CurrentUser.getOrganizationId(req),
        );
    }

    @Roles(UserRoleType.WorkProvider)
    @Delete(':id')
    deletePostedJob(@Param('id') id: string) {
        return this.jobPortalService.remove(id);
    }
}

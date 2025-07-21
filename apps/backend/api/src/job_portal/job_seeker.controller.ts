import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    Request,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
// biome-ignore lint/style/useImportType: <explanation>
import { ListStringRequestModel } from '@shega/Utilities/models/list-string.model';
// biome-ignore lint/style/useImportType: <explanation>
import { PaginationDto2 } from '@shega/Utilities/models/paginated.request2';
import { Roles } from '@shega/auth/decorators/roles.decorator';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateBasicUserDto } from '@shega/users/dto/create-user.dto';
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
    AddExperienceRequestDto,
    UpdateExperienceRequestDto,
} from './dto/request/add-experiance.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { GetJobApplicationsForApplicantRequestDto } from './dto/request/get-job-applications.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { GetJobsRequestDto } from './dto/request/get-jobs.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { JobApplicationRequestDto } from './dto/request/job-application.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateApplicantRequestDto } from './dto/request/update-applicant.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';
// biome-ignore lint/style/useImportType: <explanation>
import { JobsService } from './jobs.service';
// biome-ignore lint/style/useImportType: <explanation>
import { MentorshipService } from './mentorship.service';

@Roles(UserRoleType.JobSeeker)
@ApiTags('job-seeker')
@Controller('job-seeker')
export class JobSeekerController {
    constructor(
        private readonly jobPortalService: JobPortalService,
        private readonly jobsService: JobsService,
        private readonly mentorshipService: MentorshipService,
    ) {}

    @Roles(UserRoleType.Administrator, UserRoleType.SuperAdmin)
    @Post('newUser')
    createNewUser(@Body() dto: CreateBasicUserDto) {
        return this.jobPortalService.createJobSeeker(dto);
    }

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

    @Get('program/:id')
    findOneByProgramId(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Request() req,
    ) {
        return this.jobPortalService.findOneProgramForJobSeeker(
            id,
            CurrentUser.getApplicantId(req),
        );
    }

    @Get('job/:id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
        return this.jobPortalService.findOneForJobSeeker(
            id,
            CurrentUser.getApplicantId(req),
        );
    }

    @Post('jobs')
    getAllPending(@Body() dto: GetJobsRequestDto, @Request() req) {
        return this.jobPortalService.filterJobs(
            dto,
            CurrentUser.getApplicantId(req),
        );
    }
    @Post('mentorships')
    getAllMentorshipPrograms(@Body() dto: GetJobsRequestDto, @Request() req) {
        return this.mentorshipService.filterPrograms(
            dto,
            CurrentUser.getApplicantId(req),
        );
    }

    @Post('programs')
    getAllPrograms(@Body() dto: GetJobsRequestDto, @Request() req) {
        return this.mentorshipService.filterPrograms(
            dto,
            CurrentUser.getApplicantId(req),
        );
    }

    @Post('apply/:programId')
    apply(
        @Request() req,
        @Param('programId', new ParseUUIDPipe()) programId: string,
        @Body() dto: JobApplicationRequestDto,
    ) {
        return this.jobsService.apply(
            programId,
            CurrentUser.getApplicantId(req),
            dto,
        );
    }

    @Post('jobs/appliedByJobSeeker')
    appliedJobs(
        @Request() req,
        @Body() request: GetJobApplicationsForApplicantRequestDto,
    ) {
        return this.jobsService.jobsApplied(
            CurrentUser.getApplicantId(req),
            request,
        );
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
    addExperience(@Request() req, @Body() dto: AddExperienceRequestDto) {
        return this.jobsService.addExperience(
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
    updateExperience(
        @Request() req,
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateExperienceRequestDto,
    ) {
        return this.jobsService.updateExperience(
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
        @Param('experianceId', new ParseUUIDPipe()) experienceId: string,
    ) {
        return this.jobsService.deleteExperience(
            CurrentUser.getApplicantId(req),
            experienceId,
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

    @Post('saveProgram/:programId')
    saveProgram(@Request() req, @Param('programId') programId: string) {
        return this.jobsService.saveProgram(
            CurrentUser.getApplicantId(req),
            programId,
        );
    }

    @Delete('unsaveProgram/:programId')
    unsaveProgram(@Request() req, @Param('programId') programId: string) {
        return this.jobsService.unsaveProgram(
            CurrentUser.getApplicantId(req),
            programId,
        );
    }

    @Get('getSavedPrograms')
    getSavedPrograms(@Request() req, @Query() paginationDto: PaginationDto2) {
        return this.jobsService.getSavedProgramsByApplicantId(
            CurrentUser.getApplicantId(req),
            paginationDto,
        );
    }

    @Get('canApply')
    canApply(@Request() req) {
        return this.jobsService.checkApplicantStatus(
            CurrentUser.getApplicantId(req),
        );
    }
}

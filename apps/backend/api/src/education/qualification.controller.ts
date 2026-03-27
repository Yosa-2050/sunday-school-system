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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
import { ListStringRequestModel } from '@shega/Utilities/models/list-string.model';
import {
    AddEducationalHistoryRequestDto,
    updateEducationalHistoryRequestDto,
} from './dto/request/add-education-history.request.dto';
import {
    AddExperienceRequestDto,
    UpdateExperienceRequestDto,
} from './dto/request/add-experience.request.dto';
import { UpdateApplicantRequestDto } from './dto/request/update-applicant.request.dto';
import { QualificationDetailService } from './qualification-detail.service';
import { QualificationService } from './qualification.service';

@ApiTags('qualification')
@Controller('qualification')
export class JobSeekerController {
    constructor(
        private readonly jobPortalService: QualificationService,
        private readonly jobsService: QualificationDetailService,
    ) {}

    // @Post('upload/cv')
    // @ApiConsumes('multipart/form-data')
    // @ApiBody({
    //     schema: {
    //         type: 'object',
    //         properties: {
    //             file: {
    //                 type: 'string',
    //                 format: 'binary',
    //             },
    //         },
    //     },
    // })
    // @UseInterceptors(FileInterceptor('file'))
    // uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    //     return this.jobsService.uploadCv(CurrentUser.getApplicantId(req), file);
    // }

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

    @Get('canApply')
    canApply(@Request() req) {
        return this.jobsService.checkApplicantStatus(
            CurrentUser.getApplicantId(req),
        );
    }
}

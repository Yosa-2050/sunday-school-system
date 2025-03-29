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
import { CreateJobPortalDto } from './dto/create-job_portal.dto';
// biome-ignore lint/style/useImportType: <explanation>
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateJobPortalDto } from './dto/update-job_portal.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateBasicUserDto } from '@shega/users/dto/create-user.dto';

@ApiTags('job-portal')
@Controller('job-portal')
export class JobPortalController {
    constructor(
        private readonly jobPortalService: JobPortalService,
        private readonly documentService: DocumentService,
    ) {}

    @Roles(UserRoleType.Administrator)
    @Post('newUser')
    createNewUser(@Body() dto: CreateBasicUserDto) {
            return this.jobPortalService.createJobSeeker(dto);
        }

    @Roles(UserRoleType.WorkProvider)
    @Post()
    create(@Request() req, @Body() dto: CreateJobPortalDto) {
        return this.jobPortalService.create(
            CurrentUser.getEmployeeOrgId(req),
            CurrentUser.getOrganizationId(req),
            dto,
        );
    }

    @Roles(UserRoleType.Administrator)
    @Post('jobsByStatus')
    getAllByStatus(@Body() dto: { q: string }) {
        return this.jobPortalService.getJobsByStatusPaginated(dto.q);
    }

    @Roles(UserRoleType.Administrator)
    @Post('jobsByStatus/export')
    async exportByStatus(@Res() res: Response, @Body() dto: { q: string }) {
        const data = await this.jobPortalService.getJobsByStatusPaginated(
            dto.q,
        );
        this.documentService.generateCsv(data.data, res, 'jobList');
    }

    @Roles(UserRoleType.Administrator)
    @Post('jobsByStatus/exportSelected')
    async exportSelected(
        @Res() res: Response,
        @Body() dto: ListStringRequestModel,
    ) {
        let data = [];

        if (dto.list?.length > 0) {
            data = await this.jobPortalService.getJobsByList(dto.list);
        } else {
            data = (await this.jobPortalService.getJobsByStatusPaginated(dto.q))
                .data;
        }

        this.documentService.generateCsv(data, res, 'jobList');
    }

    @Roles(UserRoleType.WorkProvider)
    @Post('byProvider')
    getAllPostedJobsByPorvider(@Request() req, @Body() dto: { q: string }) {
        return this.jobPortalService.getJobsByStatusAndByOrgPaginated(
            CurrentUser.getOrganizationId(req),
            dto.q,
        );
    }

    @Roles(UserRoleType.Administrator)
    @Patch('approve/:id')
    approveJob(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.jobPortalService.jobApproval(id, ApprovalType.Approved);
    }

    @Roles(UserRoleType.Administrator)
    @Patch('decline/:id')
    declineJob(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: StringRequestModel,
    ) {
        return this.jobPortalService.jobApproval(
            id,
            ApprovalType.Declined,
            dto?.note,
        );
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.jobPortalService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateJobPortalDto: UpdateJobPortalDto,
    ) {
        return this.jobPortalService.update(+id, updateJobPortalDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.jobPortalService.remove(+id);
    }
}

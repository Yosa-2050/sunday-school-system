import {
    BadRequestException,
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

@ApiTags('job-portal')
@Controller('job-portal')
export class JobPortalController {
    constructor(
        private readonly jobPortalService: JobPortalService,
        private readonly documentService: DocumentService,
    ) {}

    @Roles(UserRoleType.WorkProvider)
    @Post()
    create(@Request() req, @Body() dto: CreateJobPortalDto) {
        const organizationId = req?.user?.details?.organizationId;
        const employeeOrgId = req?.user?.details?.employeeOrgId;
        if (!(organizationId && employeeOrgId)) {
            throw new BadRequestException(
                'Unable to find linked organiazation id',
            );
        }

        return this.jobPortalService.create(employeeOrgId, organizationId, dto);
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

    @Roles(UserRoleType.WorkProvider)
    @Post('byProvider')
    getAllPostedJobsByPorvider(@Request() req, @Body() dto: { q: string }) {
        const organizationId = req?.user?.details?.organizationId;
        if (!organizationId) {
            throw new BadRequestException(
                'Unable to find linked organiazation id',
            );
        }
        return this.jobPortalService.getJobsByStatusAndByOrgPaginated(
            organizationId,
            dto.q,
        );
    }

    @Roles(UserRoleType.Administrator)
    @Patch('approve/:id')
    approveJob(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.jobPortalService.approveJob(id);
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

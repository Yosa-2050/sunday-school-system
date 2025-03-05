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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateJobPortalDto } from './dto/create-job_portal.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { GetJobsByStatusRequestDto } from './dto/request/get-job-by-status.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateJobPortalDto } from './dto/update-job_portal.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
import { Roles } from '@shega/auth/decorators/roles.decorator';

@ApiTags('job-portal')
@Controller('job-portal')
export class JobPortalController {
    constructor(private readonly jobPortalService: JobPortalService) {}

    @Roles(UserRoleType.WorkProvider)
    @Post()
    create(@Request() req, @Body() dto: CreateJobPortalDto) {
        const organizationId = req?.user?.details?.organizationId;
        const employeeOrgId = req?.user?.details?.employeeOrgId;
        if(!(organizationId && employeeOrgId)) {throw new BadRequestException("Unable to find linked organiazation id")}

        return this.jobPortalService.create(employeeOrgId, organizationId, dto);
    }

    @Roles(UserRoleType.Administrator)
    @Post('jobsByStatus')
    getAllPending(@Body() dto: GetJobsByStatusRequestDto) {
        return this.jobPortalService.getJobsByStatusPaginated(
            dto.status,
            dto.pagination,
        );
    }

    @Roles(UserRoleType.WorkProvider)
    @Post('byProvider')
    getAllPostedJobsByPorvider(@Request() req, @Body() dto: GetJobsByStatusRequestDto) {
        const organizationId = req?.user?.details?.organizationId;
        if(!organizationId) {throw new BadRequestException("Unable to find linked organiazation id")}
        return this.jobPortalService.getJobsByStatusAndByOrgPaginated(
            organizationId,
            dto.status,
            dto.pagination,
        );
    }

    @Roles(UserRoleType.Administrator)
    @Patch('approve/:id')
    approveJob(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.jobPortalService.approveJob(id);
    }

    @Get('')
    findOne(@Param('id') id: string) {
        return this.jobPortalService.findOne(+id);
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

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@shega/auth/jwt-public';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateJobPortalDto } from './dto/create-job_portal.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { GetJobsByStatusRequestDto } from './dto/request/get-job-by-status.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateJobPortalDto } from './dto/update-job_portal.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';

@ApiTags('job-portal')
@Controller('job-portal')
@Public()
export class JobPortalController {
    constructor(private readonly jobPortalService: JobPortalService) {}

    @Post()
    create(@Body() createJobPortalDto: CreateJobPortalDto) {
        return this.jobPortalService.create(createJobPortalDto);
    }

    @Post('jobsByStatus')
    getAllPending(@Body() dto: GetJobsByStatusRequestDto) {
        return this.jobPortalService.getJobsByStatusPaginated(
            dto.status,
            dto.pagination,
        );
    }

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

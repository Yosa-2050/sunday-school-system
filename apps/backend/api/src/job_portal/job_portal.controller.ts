import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import type { CreateJobPortalDto } from './dto/create-job_portal.dto';
import type { UpdateJobPortalDto } from './dto/update-job_portal.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';

@Controller('job-portal')
export class JobPortalController {
    constructor(private readonly jobPortalService: JobPortalService) {}

    @Post()
    create(@Body() createJobPortalDto: CreateJobPortalDto) {
        return this.jobPortalService.create(createJobPortalDto);
    }

    @Get()
    findAll() {
        return this.jobPortalService.findAll();
    }

    @Get(':id')
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

import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateUsingNameRequestDto } from './dto/request/create-name.request.dto';

@ApiBearerAuth()
@ApiTags('job-detail')
@Controller('job-detail')
export class JobDetailController {
    constructor(private jobPortalService: JobPortalService) {}

    @Post('categories')
    postCategories(@Body() dto: CreateUsingNameRequestDto) {
        return this.jobPortalService.createCategories(dto.name);
    }

    @Post('categories/:parentId')
    addUsingParent(
        @Param('parentId', new ParseUUIDPipe()) id: string,
        @Body() dto: CreateUsingNameRequestDto,
    ) {
        return this.jobPortalService.addCategoriesByParentId(id, dto.name);
    }

    @Post('skills')
    postSkills(@Body() dto: CreateUsingNameRequestDto) {
        return this.jobPortalService.createSkills(dto.name);
    }

    @Get('categories')
    categories() {
        return this.jobPortalService.findCategories();
    }

    @Get('skills')
    skills() {
        return this.jobPortalService.findSkills();
    }

    @Get('categories/:parentId')
    findOne(@Param('parentId', new ParseUUIDPipe()) id: string) {
        return this.jobPortalService.getCategoriesByParentId(id);
    }
}

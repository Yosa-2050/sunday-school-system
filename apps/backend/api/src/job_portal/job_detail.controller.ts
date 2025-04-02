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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateUsingNameRequestDto } from './dto/request/create-name.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';

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

    @Patch('categories/:id')
    editCategories(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: CreateUsingNameRequestDto,
    ) {
        return this.jobPortalService.updateCategories(id, dto.name);
    }

    @Patch('skills/:id')
    editSkills(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: CreateUsingNameRequestDto,
    ) {
        return this.jobPortalService.updateSkills(id, dto.name);
    }

    @Delete('categories/:id')
    deleteCategories(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.jobPortalService.deleteCategories(id);
    }

    @Delete('skills/:id')
    deleteSkills(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.jobPortalService.deleteSkills(id);
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

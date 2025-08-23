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
// biome-ignore lint/style/useImportType: <explanation>
import { ListStringRequestModel } from '@shega/Utilities/models/list-string.model';
import { Public } from '@shega/auth/jwt-public';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateUsingNameRequestDto } from '@shega/job_portal/dto/request/create-name.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { GroupService } from '../service/group.service';

@Public()
@ApiTags('group')
@Controller('group')
export class GroupController {
    constructor(private groupService: GroupService) {}

    @Post()
    postGroup(@Body() dto: CreateUsingNameRequestDto) {
        return this.groupService.createCategories(dto.name);
    }

    @Post('/:parentId')
    addUsingParent(
        @Param('parentId', new ParseUUIDPipe()) id: string,
        @Body() dto: CreateUsingNameRequestDto,
    ) {
        return this.groupService.addCategoriesByParentId(id, dto.name);
    }

    @Patch('/:id')
    editGroup(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: CreateUsingNameRequestDto,
    ) {
        return this.groupService.updateCategories(id, dto.name);
    }

    @Delete('/:id')
    deleteGroup(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.groupService.deleteCategories(id);
    }

    @Get()
    group() {
        return this.groupService.findCategories();
    }

    @Get('/:parentId')
    findOne(@Param('parentId', new ParseUUIDPipe()) id: string) {
        return this.groupService.getCategoriesByParentId(id);
    }

    @Post('groupByParent')
    findMultipleByParent(@Body() request: ListStringRequestModel) {
        return this.groupService.getListCategoriesByParentIds(request.list);
    }

    @Get('groupById/:id')
    groupById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.groupService.findCategoryById(id);
    }
}

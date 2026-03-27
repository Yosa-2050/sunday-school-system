import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Request,
} from '@nestjs/common';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
import { DocumentService } from '@shega/document/document.service';
import { AddDepartmentRequestDto } from '../dto/request/add-department.request.dto';
import { DepartmentService } from '../services/department.service';

@Controller('department')
export class DepartmentController {
    constructor(
        private readonly departmentService: DepartmentService,
        private documentService: DocumentService,
    ) {}

    @Post()
    create(@Body() dto: AddDepartmentRequestDto, @Request() req) {
        return this.departmentService.create(
            dto,
            CurrentUser.getOrganizationId(req, true),
        );
    }

    @Get()
    findAll(@Request() req) {
        return this.departmentService.findAll(
            CurrentUser.getOrganizationId(req, true),
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.departmentService.findOne(
            id,
            CurrentUser.getOrganizationId(req, true),
        );
    }

    @Get('byParent/:id')
    findByParent(@Param('id') id: string, @Request() req) {
        return this.departmentService.findAllByParentId(
            id,
            CurrentUser.getOrganizationId(req, true),
        );
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: AddDepartmentRequestDto) {
        return this.departmentService.updateByName(id, body.name);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.departmentService.deleteByName(id);
    }
}

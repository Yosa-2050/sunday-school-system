import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { Public } from '@shega/auth/jwt-public';
import type { DocumentService } from '@shega/document/document.service';
import type { DepartmentService } from './department.service';
import type { AddDepartmentRequestDto } from './dto/request/add-department.request.dto';

@Public()
@Controller('department')
export class DepartmentController {
    constructor(
        private readonly departmentService: DepartmentService,
        private documentService: DocumentService,
    ) {}

    @Post()
    create(@Body() dto: AddDepartmentRequestDto) {
        return this.departmentService.create(dto);
    }

    @Get()
    findAll() {
        return this.departmentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.departmentService.findOne(id);
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

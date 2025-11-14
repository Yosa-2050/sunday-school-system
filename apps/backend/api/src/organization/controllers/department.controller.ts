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
// biome-ignore lint/style/useImportType: <explanation>
import { DocumentService } from '@shega/document/document.service';
// biome-ignore lint/style/useImportType: <explanation>
import { AddDepartmentRequestDto } from '../dto/request/add-department.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { DepartmentService } from '../services/department.service';

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

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Res,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
// biome-ignore lint/style/useImportType: <explanation>
import { DocumentService } from '@shega/document/document.service';
// import { DocumentService } from '@shega/document/document.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Response } from 'express';
// biome-ignore lint/style/useImportType: <explanation>
import { AddOrganizationBranchDto } from './dto/request/add-branch.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { AssignEmployeeRequestDto } from './dto/request/assign-security-person.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateOrganizationEmployeeDto } from './dto/request/create-employee.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateOrganizationDto } from './dto/request/create-organization.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateOrganizationDto } from './dto/request/update-organization.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { OrganizationService } from './organization.service';
// biome-ignore lint/style/useImportType: <explanation>
import { ListStringRequestModel } from '@shega/Utilities/models/list-string.model';

@Controller('organization')
export class OrganizationController {
    constructor(
        private readonly organizationService: OrganizationService,
        private documentService: DocumentService,
    ) {}

    @Post('createEmployee')
    createEmployee(@Body() dto: CreateOrganizationEmployeeDto) {
        return this.organizationService.CreateEmployeeQDE(dto);
    }

    @Post()
    create(@Body() createOrganizationDto: CreateOrganizationDto) {
        return this.organizationService.create(createOrganizationDto);
    }

    @Post('/addBranch/:organizationId')
    addBranch(
        @Param('organizationId') id: string,
        @Body() request: AddOrganizationBranchDto,
    ) {
        return this.organizationService.addBranch(request, id);
    }

    @Post('/assignEmployee')
    assignEmployee(@Body() request: AssignEmployeeRequestDto) {
        return this.organizationService.assignEmployee(request);
    }

    @Post('/all')
    findAll(@Body() dto: { q: string }) {
        return this.organizationService.findAllPaginated(dto.q);
    }

    @Post('/export')
    async export(@Body() dto: { q: string }, @Res() res: Response) {
        const org = await this.organizationService.findAllPaginated(dto.q);

        this.documentService.generateCsv(org.data, res, 'organizationList');
    }

    @Post('exportSelected')
        async exportSelected(@Res() res: Response, @Body() dto: ListStringRequestModel) {
            const data = await this.organizationService.getList(
                dto.list,
            );
    
            this.documentService.generateCsv(data, res, 'organizationList');
        }

    @Get('/listEmployee/:organizationId')
    findAllEmployee(@Param('organizationId') id: string) {
        return this.organizationService.findEmployee(id);
    }

    @Get('/listBranches/:organizationId')
    findAllBranches(@Param('organizationId') id: string) {
        return this.organizationService.findBranches(id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.organizationService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateOrganizationDto: UpdateOrganizationDto,
    ) {
        return this.organizationService.update(+id, updateOrganizationDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.organizationService.remove(+id);
    }
}

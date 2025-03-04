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
import { PaginationDto } from '@shega/Utilities/models/paginated.request';

@Public()
@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

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

    @Post("/all")
    findAll(@Body() dto: PaginationDto) {
        return this.organizationService.findAllPaginated(dto);
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

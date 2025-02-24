import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { Public } from 'src/auth/jwt-public';
import { AddOrganizationBranchDto } from './dto/request/add-branch.dto';
import { AssignEmployeeRequestDto } from './dto/request/assign-security-person.request.dto';
import { CreateOrganizationDto } from './dto/request/create-organization.dto';
import { UpdateOrganizationDto } from './dto/request/update-organization.dto';
import { OrganizationService } from './organization.service';

@Public()
@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

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

    @Get('/listEmployee/:organizationId')
    findAllEmployee(@Param('organizationId') id: string) {
        return this.organizationService.findEmployee(id);
    }

    @Get('/listBranches/:organizationId')
    findAllBranches(@Param('organizationId') id: string) {
        return this.organizationService.findBranches(id);
    }

    @Get()
    findAll() {
        return this.organizationService.findAll();
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

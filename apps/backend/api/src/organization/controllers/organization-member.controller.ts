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
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
import { StringRequestModel } from '@shega/Utilities/models/list-string.model';
// biome-ignore lint/style/useImportType: <explanation>
import { PaginationDto } from '@shega/Utilities/models/paginated.request';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateEmployeeDto } from '../dto/request/create-organization-member.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateEmployeeDto } from '../dto/request/update-employee.dto';
import { OrganizationMemberService } from '../services/organization-member.service';

@ApiTags('organization-member')
@Controller('organization-member')
export class OrganizationMemberController {
    constructor(private readonly employeesService: OrganizationMemberService) {}

    @Post('create')
    CreateEmployee(@Body() dto: CreateEmployeeDto, @Request() req) {
        return this.employeesService.CreateEmployee(
            dto,
            CurrentUser.getOrganizationId(req),
        );
    }

    @Post('bulk-create')
    bulkCreate(@Body() dtos: CreateEmployeeDto[], @Request() req) {
        return this.employeesService.bulkCreate(
            dtos,
            CurrentUser.getOrganizationId(req),
        );
    }

    @Get('me')
    getMyInformation() {
        return this.employeesService.getMe();
    }

    @Get('member-list')
    findAll(@Request() req) {
        return this.employeesService.findAll(
            CurrentUser.getOrganizationId(req),
        );
    }

    @Post('member-list')
    findAllPaginated(@Body() dto: PaginationDto, @Request() req) {
        return this.employeesService.findAllPaginated(
            CurrentUser.getOrganizationId(req),
            dto,
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.employeesService.findByIdOrThrow(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ) {
        return this.employeesService.update(+id, updateEmployeeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.employeesService.remove(+id);
    }

    @Post('/search')
    searchProfile(@Body() body: StringRequestModel, @Request() req) {
        return this.employeesService.search(
            body.text,
            CurrentUser.getOrganizationId(req),
        );
    }
}

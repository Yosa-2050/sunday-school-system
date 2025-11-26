import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateEmployeeDto } from '../dto/request/update-employee.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { OrganizationMemberService } from '../services/organization-member.service';

@ApiTags('organization-member')
@Controller('organization-member')
export class OrganizationMemberController {
    constructor(private readonly employeesService: OrganizationMemberService) {}

    @Get('me')
    getMyInformation() {
        return this.employeesService.getMe();
    }

    @Get()
    findAll() {
        return this.employeesService.findAll();
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
}

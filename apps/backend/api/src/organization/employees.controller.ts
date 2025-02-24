import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserContext } from 'src/auth/decorators/user.context.decorator';
import { Public } from 'src/auth/jwt-public';
import type { UserDto } from 'src/users/dto/user.dto';
import type { CreateEmployeeDto } from './dto/request/create-employee.dto';
import type { UpdateEmployeeDto } from './dto/request/update-employee.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { EmployeesService } from './employees.service';

// @ApiBearerAuth()
@Public()
@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    //@Roles(UserRoleType.ADMINISTRATOR)
    @Post('createEmployee')
    createEmployee(
        @Body() createEmployeeDto: CreateEmployeeDto,
        @UserContext() user: UserDto,
    ) {
        //return this.employeesService.CreateEmployee(createEmployeeDto);
    }

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
        return this.employeesService.findOne(id);
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

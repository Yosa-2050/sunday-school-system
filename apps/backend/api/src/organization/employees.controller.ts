import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { CreateEmployeeDto } from "./dto/request/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/request/update-employee.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRoleType } from "src/users/enums/user-role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserContext } from "src/auth/decorators/user.context.decorator";
import { CurrentUser } from "src/Utilities/current-user.utility";
import { Public } from "src/auth/jwt-public";

// @ApiBearerAuth()
@Public()
@ApiTags("employees")
@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  //@Roles(UserRoleType.ADMINISTRATOR)
  @Post("createEmployee")
  createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UserContext() user: any
  ) {
    return this.employeesService.CreateEmployee(
      createEmployeeDto
    );
  }

  @Get("me")
  getMyInformation() {
    return this.employeesService.getMe();
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto
  ) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.employeesService.remove(+id);
  }
}

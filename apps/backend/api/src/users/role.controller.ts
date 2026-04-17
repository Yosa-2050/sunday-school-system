import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "@shega/auth/jwt-public";
import { AddRoleDto } from "./dto/request/add-role.request.dto";
import { UsersService } from "./users.service";
import { UserRoleType } from "./enums/user-role.enum";
import { PaginationDto } from "@shega/Utilities/models/paginated.request";
import { GetUsersByRoleDto } from "./dto/get-user-by-role.dto";


@Public()
@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(
     private readonly usersService: UsersService,
  ) {}

  @Post('add-role')
      addRole(
          @Query('userId', new ParseUUIDPipe()) userId: string,
          @Body() body: AddRoleDto,
      ) {
          if (!body.role) {
              throw new BadRequestException('Role is required');
          }
          return this.usersService.addRole(userId, body.role);
      }

  @Get('roles/:userId')
   getUserRoles(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.usersService.getUserRoles(userId);
}

  @Post('users-by-role')
  getUsersByRole(
   @Body() dto: GetUsersByRoleDto,
  ) {
    return this.usersService.getUsersByRolePaginated(dto);
  }

  @Post('remove-role')
   removeRole(
    @Query('userId', ParseUUIDPipe) userId: string,
    @Body() body: AddRoleDto,
  ) {

    if (!body.role) {
      throw new BadRequestException('Role is required');
    }

   return this.usersService.removeRole(userId, body.role);
}
}
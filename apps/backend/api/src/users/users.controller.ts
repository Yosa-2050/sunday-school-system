import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  BadRequestException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { updatePasswordRequest } from "./dto/update-password.request.dto";
import { LoginBy } from "./enums/login-by.enum";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ deprecated: true })
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createFromProfile(dto.email, dto.role, "", false, LoginBy.EMAIL);
  }

  @Post("updatePassword")
  updatePassword(@Body() updatePwdDto: updatePasswordRequest) {
    return this.usersService.UpdatePassword(updatePwdDto);
  }

  @Patch(":id")
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.usersService.remove(id);
  }
}

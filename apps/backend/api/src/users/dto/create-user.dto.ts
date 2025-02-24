import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString } from "class-validator";
import { UserRoleType } from "../enums/user-role.enum";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  password: string;

  @ApiProperty()
  @IsEnum(UserRoleType)
  role: UserRoleType;
}

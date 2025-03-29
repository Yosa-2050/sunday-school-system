import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoleType } from '../enums/user-role.enum';

export class CreateBasicUserDto{

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    middleName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;
}

export class CreateUserDto extends CreateBasicUserDto {
    password: string;

    @ApiProperty()
    @IsEnum(UserRoleType)
    role: UserRoleType;
}

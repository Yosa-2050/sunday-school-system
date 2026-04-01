import { ApiProperty } from '@nestjs/swagger';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class AddRoleDto {
    @ApiProperty()
    @IsEnum(UserRoleType)
    @IsNotEmpty()
    role: UserRoleType;
}
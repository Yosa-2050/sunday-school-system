import { ApiProperty } from '@nestjs/swagger';
import { UserRoleType } from '@shega/users/enums/user-role.enum';

export class AddRoleDto {
    @ApiProperty({
        enum: UserRoleType,
        description: 'The role to be added to the user',
    })
    role: UserRoleType;
}
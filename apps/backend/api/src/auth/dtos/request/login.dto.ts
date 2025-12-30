import { ApiProperty } from '@nestjs/swagger';
import { OptionalEnum } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
import { IsString } from 'class-validator';
import { UsernameRequestDto } from './username.dto';

export class LoginRequestDto extends UsernameRequestDto {
    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty()
    @OptionalEnum(UserRoleType)
    role: UserRoleType;
}

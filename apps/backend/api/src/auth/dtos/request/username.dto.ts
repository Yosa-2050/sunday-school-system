import { ApiProperty } from '@nestjs/swagger';
import { OriginEnums } from '@shega/auth/enums/origin.enum';
import { IsString, IsUUID } from 'class-validator';

export class UsernameRequestDto {
    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    origin: OriginEnums;
}

export class PasswordResetDto {
    @ApiProperty()
    @IsUUID()
    userId: string;

    @ApiProperty()
    @IsString()
    oldPassword: string;

    @ApiProperty()
    @IsString()
    newPassword: string;
}

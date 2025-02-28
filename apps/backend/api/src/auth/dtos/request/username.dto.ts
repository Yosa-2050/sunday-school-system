import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class UsernameRequestDto {
    @ApiProperty()
    @IsString()
    username: string;
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

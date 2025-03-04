import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UsernameRequestDto } from './username.dto';

export class LoginRequestDto extends UsernameRequestDto {
    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsString()
    origin: string;
}

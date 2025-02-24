import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { LoginRequestDto } from './login.dto';

export class ValidateResteRequestDto extends LoginRequestDto {
    @ApiProperty()
    @IsString()
    otp: string;
}

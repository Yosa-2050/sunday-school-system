import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class updatePasswordRequest {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    password: string;
}

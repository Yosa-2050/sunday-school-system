import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddDepartmentRequestDto {
    @ApiProperty()
    @IsString()
    name: string;
}

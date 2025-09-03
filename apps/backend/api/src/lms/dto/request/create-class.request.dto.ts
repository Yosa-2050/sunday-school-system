import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class ClassRequestDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    rootId: string;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    section?: string[];
}

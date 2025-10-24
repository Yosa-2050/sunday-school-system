import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class TestRequestDto {
    @ApiProperty()
    @IsUUID()
    subjectId: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNumber()
    weight: number;

    @ApiProperty()
    @IsString()
    type: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    content: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    documentId: string;

    @ApiProperty()
    @IsBoolean()
    isGroupAssignment: boolean;
}

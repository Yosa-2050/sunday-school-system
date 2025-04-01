import { ApiProperty } from '@nestjs/swagger';
import { EducationalRequirmentType } from '@shega/job_portal/enums/education-requirment-type.enum';
import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class AddEducationalHistoryRequestDto {
    @ApiProperty()
    @IsString()
    school: string;

    @ApiProperty()
    @IsEnum(EducationalRequirmentType)
    level: EducationalRequirmentType;

    @ApiProperty()
    @IsUUID()
    fieldOfStudyId: string;

    @ApiProperty()
    @IsString()
    startDate: Date;

    @ApiProperty()
    @IsString()
    @IsOptional()
    endDate: Date;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    grade: number;

    @ApiProperty()
    @IsString()
    description: string;
}

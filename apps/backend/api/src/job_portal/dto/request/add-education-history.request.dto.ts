import { ApiProperty, PartialType } from '@nestjs/swagger';
import { EducationalRequirementType } from '@shega/job_portal/enums/education-requirement-type.enum';
import { Transform } from 'class-transformer';
import {
    IsDateString,
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
    @IsEnum(EducationalRequirementType)
    level: EducationalRequirementType;

    @ApiProperty()
    @IsUUID()
    fieldOfStudyId: string;

    @ApiProperty()
    @IsDateString()
    startDate: Date;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    endDate: Date;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    grade: number;

    @ApiProperty()
    @IsString()
    description: string;
}

export class updateEducationalHistoryRequestDto extends PartialType(
    AddEducationalHistoryRequestDto,
) {}

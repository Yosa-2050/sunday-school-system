import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';
import { EmploymentType } from '../enums/employment-type.enum';
import { SalaryType } from '../enums/salary-type.enum';
import { EducationalRequirmentType } from '../enums/education-requirment-type.enum';
import { ExperianceLevelType } from '../enums/experiance-level-type.enum';
import { SalaryFrequencyType } from '../enums/salary-frequency-type.enum';
import { WorkPlaceType } from '../enums/work-place-type.enum';
import { Transform } from 'class-transformer';

export class CreateJobPortalDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsEnum(EmploymentType)
    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    type: EmploymentType;

    @ApiProperty()
    @IsNumber()
    salaryFrom: number;

    @ApiProperty()
    @IsNumber()
    salaryTo: number;

    @ApiProperty()
    @IsEnum(SalaryType)
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsOptional()
    salaryType: SalaryType; //fixed, negotiable

    @ApiProperty()
    @IsEnum(SalaryFrequencyType)
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsOptional()
    salaryFrequency: SalaryFrequencyType;

    @ApiProperty()
    @IsEnum(WorkPlaceType)
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsOptional()
    workPlace: WorkPlaceType;

    @ApiProperty()
    @IsString()
    @IsUUID()
    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    stateId: string;

    @ApiProperty()
    @IsString()
    @IsUUID()
    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    cityId: string;

    @ApiProperty()
    @IsEnum(ExperianceLevelType)
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsOptional()
    experianceLevel: ExperianceLevelType;

    @ApiProperty()
    @IsNumber()
    experiance: number;

    @ApiProperty()
    @IsString()
    deadline: Date;

    @ApiProperty()
    @IsEnum(EducationalRequirmentType)
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsOptional()
    educationalRequirment: EducationalRequirmentType;

    @ApiProperty()
    @IsArray()
    skills: string[];

    @ApiProperty()
    @IsArray()
    catagories: string[];

    @ApiProperty()
    @IsBoolean()
    isPublished: boolean;
}

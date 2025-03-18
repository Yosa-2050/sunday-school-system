import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { EmploymentType } from '../enums/employment-type.enum';
import { SalaryType } from '../enums/salary-type.enum';
import { EducationalRequirmentType } from '../enums/education-requirment-type.enum';
import { ExperianceLevelType } from '../enums/experiance-level-type.enum';
import { SalaryFrequencyType } from '../enums/salary-frequency-type.enum';
import { WorkPlaceType } from '../enums/work-place-type.enum';

export class CreateJobPortalDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsEnum(EmploymentType)
    type: EmploymentType;

    @ApiProperty()
    @IsNumber()
    salaryFrom: number;

    @ApiProperty()
    @IsNumber()
    salaryTo: number;

    @ApiProperty()
    @IsEnum(SalaryType)
    salary: SalaryType; //fixed, negotiable

    @ApiProperty()
    @IsEnum(SalaryFrequencyType)
    salaryFrequency: SalaryFrequencyType;

    @ApiProperty()
    @IsEnum(WorkPlaceType)
    workPlace: WorkPlaceType;

    @ApiProperty()
    @IsString()
    country: string;

    @ApiProperty()
    @IsString()
    state: string;

    @ApiProperty()
    @IsString()
    city: string;

    @ApiProperty()
    @IsEnum(ExperianceLevelType)
    experianceLevel: ExperianceLevelType;

    @ApiProperty()
    @IsNumber()
    experiance: number;

    @ApiProperty()
    @IsString()
    deadline: Date;

    @ApiProperty()
    @IsEnum(EducationalRequirmentType)
    educationalRequirment: EducationalRequirmentType;

    @ApiProperty()
    @IsArray()
    skills: string[];

    @ApiProperty()
    @IsArray()
    catagory: string[];

    @ApiProperty()
    @IsString()
    isPublished: boolean;
}

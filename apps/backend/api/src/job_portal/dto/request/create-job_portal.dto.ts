import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';
import { CurrencyType } from '../../enums/currency-type.enum';
import { EducationalRequirmentType } from '../../enums/education-requirment-type.enum';
import { EmploymentType } from '../../enums/employment-type.enum';
import { ExperianceLevelType } from '../../enums/experiance-level-type.enum';
import { SalaryFrequencyType } from '../../enums/salary-frequency-type.enum';
import { SalaryType } from '../../enums/salary-type.enum';
import { WorkPlaceType } from '../../enums/work-place-type.enum';
import { JobDescriptionType } from '@shega/job_portal/enums/job-description-type.enum';

export class JobDescriptionDto{
    @ApiProperty()
    @IsString()
    descripiton: string;

    @ApiProperty()
    @IsEnum(JobDescriptionType)
    type: JobDescriptionType;
}

export class CreateJobPortalDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsEnum(EmploymentType)
    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    type?: EmploymentType;

    @ApiProperty()
    @IsEnum(CurrencyType)
    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    currency?: CurrencyType;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    salaryFrom?: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    salaryTo?: number;

    @ApiProperty()
    @IsEnum(SalaryType)
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsOptional()
    salaryType?: SalaryType; //fixed, negotiable

    @ApiProperty()
    @IsEnum(SalaryFrequencyType)
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsOptional()
    salaryFrequency?: SalaryFrequencyType;

    @ApiProperty()
    @IsEnum(WorkPlaceType)
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsOptional()
    workPlace?: WorkPlaceType;

    @ApiProperty()
    @IsString()
    @IsUUID()
    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    stateId?: string;

    @ApiProperty()
    @IsString()
    @IsUUID()
    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    cityId?: string;

    @ApiProperty()
    @IsEnum(ExperianceLevelType)
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsOptional()
    experianceLevel?: ExperianceLevelType;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    experiance?: number;

    @ApiProperty()
    @IsOptional()
    deadline?: Date;

    @ApiProperty()
    @IsEnum(EducationalRequirmentType)
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsOptional()
    educationalRequirment?: EducationalRequirmentType;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    skills?: string[];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    catagories?: string[];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    jobDescriptions?: JobDescriptionDto[];


    @ApiProperty()
    @IsBoolean()
    isPublished: boolean;
}

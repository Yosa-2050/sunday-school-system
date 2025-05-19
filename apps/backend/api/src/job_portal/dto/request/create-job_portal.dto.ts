import { ApiProperty } from '@nestjs/swagger';
import {
    OptionalEnum,
    OptionalUUID,
} from '@shega/Utilities/decorators/optional-uuid.decorator';
import { JobDescriptionType } from '@shega/job_portal/enums/job-description-type.enum';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { CurrencyType } from '../../enums/currency-type.enum';
import { EducationalRequirmentType } from '../../enums/education-requirment-type.enum';
import { EmploymentType } from '../../enums/employment-type.enum';
import { ExperianceLevelType } from '../../enums/experiance-level-type.enum';
import { SalaryFrequencyType } from '../../enums/salary-frequency-type.enum';
import { SalaryType } from '../../enums/salary-type.enum';
import { WorkPlaceType } from '../../enums/work-place-type.enum';

export class JobDescriptionDto {
    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty({
        example: JobDescriptionType.Benefits,
        description: 'benefits of the job',
    })
    @IsEnum(JobDescriptionType)
    type: JobDescriptionType;
}

export class ProgramRequestDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @OptionalUUID()
    countryId?: string;

    @ApiProperty()
    @OptionalUUID()
    stateId?: string;

    @ApiProperty()
    @OptionalUUID()
    cityId?: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    numberOfApplicants?: number;

    @ApiProperty({
        example: ExperianceLevelType.Entry,
        description: 'Entry level experiance',
    })
    @OptionalEnum(ExperianceLevelType)
    experianceLevel?: ExperianceLevelType;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    experiance?: number;

    @ApiProperty({
        example: WorkPlaceType.Remote,
        description: 'Remote workplace',
    })
    @OptionalEnum(WorkPlaceType)
    workPlace?: WorkPlaceType;

    @ApiProperty()
    @IsOptional()
    deadline?: Date;

    @ApiProperty({
        example: EducationalRequirmentType.Diplom,
        description: 'Diplom educational',
    })
    @OptionalEnum(EducationalRequirmentType)
    educationalRequirment?: EducationalRequirmentType;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    skills?: string[];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    catagories?: string[];

    @IsOptional()
    @IsArray()
    @ApiProperty({ type: [JobDescriptionDto] })
    @ValidateNested({})
    @Type(() => JobDescriptionDto)
    jobDescriptions?: JobDescriptionDto[];

    @ApiProperty()
    @IsBoolean()
    isPublished: boolean;
}

export class CreateJobPortalDto extends ProgramRequestDto {
    @ApiProperty()
    @OptionalEnum(EmploymentType)
    type?: EmploymentType;

    @ApiProperty()
    @OptionalEnum(CurrencyType)
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
    @OptionalEnum(SalaryType)
    salaryType?: SalaryType; //fixed, negotiable

    @ApiProperty()
    @OptionalEnum(SalaryFrequencyType)
    salaryFrequency?: SalaryFrequencyType;
}

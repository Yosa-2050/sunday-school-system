import { ApiProperty } from '@nestjs/swagger';
import {
    OptionalEnum,
    OptionalUUID,
} from '@shega/Utilities/decorators/optional-uuid.decorator';
import { PaginationDto } from '@shega/Utilities/models/paginated.request';
import { CommitmentType } from '@shega/job_portal/enums/commitment-type.enum';
import { CurrencyType } from '@shega/job_portal/enums/currency-type.enum';
import { EmploymentType } from '@shega/job_portal/enums/employment-type.enum';
import { ExperienceLevelType } from '@shega/job_portal/enums/experience-level-type.enum';
import { MentorshipType } from '@shega/job_portal/enums/mentorship-type.enum';
import { ProgramType } from '@shega/job_portal/enums/program-type.enum';
import { SalaryFrequencyType } from '@shega/job_portal/enums/salary-frequency-type.enum';
import { SalaryType } from '@shega/job_portal/enums/salary-type.enum';
import { Type } from 'class-transformer';
import {
    IsDefined,
    IsNotEmptyObject,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

export class GetJobsRequestDto {
    @ApiProperty()
    @OptionalEnum(ProgramType)
    programType?: ProgramType;

    @ApiProperty()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty()
    @OptionalUUID()
    categoryId?: string;

    @ApiProperty()
    @OptionalUUID()
    organizationId?: string;

    @ApiProperty()
    @OptionalUUID()
    mentorId?: string;

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
    @OptionalEnum(EmploymentType)
    type?: EmploymentType;

    @ApiProperty()
    @OptionalEnum(ExperienceLevelType)
    experianceLevel?: ExperienceLevelType;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    salaryFrom?: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    salaryTo?: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    duration?: number;

    @ApiProperty()
    @OptionalEnum(SalaryType)
    salaryType?: SalaryType;

    @ApiProperty()
    @OptionalEnum(SalaryFrequencyType)
    salaryFrequency?: SalaryFrequencyType;

    @ApiProperty()
    @OptionalEnum(CurrencyType)
    currency?: CurrencyType;

    @ApiProperty()
    @OptionalEnum(MentorshipType)
    mentorshipType?: MentorshipType;

    @ApiProperty()
    @OptionalEnum(CommitmentType)
    commitment?: CommitmentType;

    @ApiProperty()
    @OptionalEnum(ExperienceLevelType)
    audience?: ExperienceLevelType;

    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto)
    pagination: PaginationDto;
}

import { ApiProperty } from '@nestjs/swagger';
import {
    OptionalEnum,
    OptionalUUID,
} from '@shega/Utilities/decorators/optional-uuid.decorator';
import { PaginationDto } from '@shega/Utilities/models/paginated.request';
import { EmploymentType } from '@shega/job_portal/enums/employment-type.enum';
import { ExperienceLevelType } from '@shega/job_portal/enums/experiance-level-type.enum';
import { ProgramType } from '@shega/job_portal/enums/program-type.enum';
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
    countryId?: string;

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
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto)
    pagination: PaginationDto;
}

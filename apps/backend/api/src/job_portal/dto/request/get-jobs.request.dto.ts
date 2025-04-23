import { ApiProperty } from '@nestjs/swagger';
import { EmploymentType } from '@shega/job_portal/enums/employment-type.enum';
import { ExperianceLevelType } from '@shega/job_portal/enums/experiance-level-type.enum';
import { PaginationDto } from '@shega/Utilities/models/paginated.request';
import { Transform, Type } from 'class-transformer';
import {
    IsDefined,
    IsEnum,
    IsNotEmptyObject,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';

export class GetJobsRequestDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    @Transform(({ value }) => (value === '' ? undefined : value))
    categoryId?: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    @Transform(({ value }) => (value === '' ? undefined : value))
    organizationId?: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    @Transform(({ value }) => (value === '' ? undefined : value))
    cityId?: string;

    @ApiProperty()
    @IsEnum(EmploymentType)
    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    type?: EmploymentType;

    @ApiProperty()
    @IsEnum(ExperianceLevelType)
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsOptional()
    experianceLevel?: ExperianceLevelType;

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

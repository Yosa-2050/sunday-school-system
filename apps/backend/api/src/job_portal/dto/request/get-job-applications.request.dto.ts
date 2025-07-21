import { ApiProperty } from '@nestjs/swagger';
import { OptionalEnum } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { PaginationDto } from '@shega/Utilities/models/paginated.request';
import { EducationalRequirementType } from '@shega/job_portal/enums/education-requirement-type.enum';
import { ApplicationStatus } from '@shega/job_portal/enums/job-application-status.enum';
import { Gender } from '@shega/users/enums/profile-gender.enum';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsDefined,
    IsNotEmptyObject,
    IsNumber,
    IsObject,
    IsOptional,
    ValidateNested,
} from 'class-validator';

export class GetJobApplicationsRequestDto {
    @ApiProperty()
    @OptionalEnum(ApplicationStatus)
    status: ApplicationStatus;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    experienceFrom: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    experienceTo: number;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    category: string[];

    @ApiProperty()
    @IsOptional()
    @IsArray()
    skills: string[];

    @ApiProperty()
    @OptionalEnum(Gender)
    gender: Gender;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    ageTo: number;

    @ApiProperty()
    @IsOptional()
    ageFrom: number;

    @ApiProperty()
    @OptionalEnum(EducationalRequirementType)
    educationalRequirement: EducationalRequirementType;

    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto)
    pagination: PaginationDto;
}

export class GetJobApplicationsForApplicantRequestDto {
    @ApiProperty()
    @OptionalEnum(ApplicationStatus)
    status: ApplicationStatus;

    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto)
    pagination: PaginationDto;
}

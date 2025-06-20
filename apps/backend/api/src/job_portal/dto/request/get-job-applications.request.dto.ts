import { ApiProperty } from '@nestjs/swagger';
import { OptionalEnum } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { PaginationDto } from '@shega/Utilities/models/paginated.request';
import { ApplicationStatus } from '@shega/job_portal/enums/job-application-status.enum';
import { Gender } from '@shega/users/enums/profile-gender.enum';
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

export class GetJobApplicationsRequestDto {
    @ApiProperty()
    @OptionalEnum(ApplicationStatus)
    status: ApplicationStatus;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    experience: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    category: string;

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
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto)
    pagination: PaginationDto;
}

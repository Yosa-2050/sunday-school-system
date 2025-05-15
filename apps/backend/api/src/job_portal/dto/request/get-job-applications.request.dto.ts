import { ApiProperty } from "@nestjs/swagger";
import { ApplicationStatus } from "@shega/job_portal/enums/job-application-status.enum";
import { OptionalEnum } from "@shega/Utilities/decorators/optional-uuid.decorator";
import { PaginationDto } from "@shega/Utilities/models/paginated.request";
import { Type } from "class-transformer";
import { IsDefined, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";

export class GetJobApplicationsRequestDto{
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
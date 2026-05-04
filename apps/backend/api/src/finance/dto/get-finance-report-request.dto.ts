import { ApiProperty } from "@nestjs/swagger";
import { OptionalEnum } from "@shega/Utilities/decorators/optional-uuid.decorator";
import { ReportStatus } from "@shega/Utilities/enums/report-status.enum";
import { PaginationDto } from "@shega/Utilities/models/paginated.request";
import { Type } from "class-transformer";
import { IsOptional, IsDateString, IsDefined, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";

export class GetFinanceReportRequestDto {
    @ApiProperty()
    @OptionalEnum(ReportStatus)
    reportStatus: ReportStatus;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto)
    pagination: PaginationDto;
}
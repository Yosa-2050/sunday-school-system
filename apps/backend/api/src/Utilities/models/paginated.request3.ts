import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDateString,
    IsDefined,
    IsNotEmptyObject,
    IsObject,
    IsOptional,
    ValidateNested,
} from 'class-validator';
import { OptionalEnum } from '../decorators/optional-uuid.decorator';
import { ReportStatus } from '../enums/report-status.enum';
import { PaginationDto } from './paginated.request';

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

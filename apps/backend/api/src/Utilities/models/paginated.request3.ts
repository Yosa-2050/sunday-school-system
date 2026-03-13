import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsDateString,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { OptionalEnum } from '../decorators/optional-uuid.decorator';
import { ReportStatus } from '../enums/report-status.enum';

export class PaginationDto3 {
    @ApiProperty()
    @OptionalEnum(ReportStatus)
    status: ReportStatus;

    @ApiProperty()
    @IsString()
    @IsOptional()
    search: string;

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Transform(({ value }) => (value === 0 ? 1 : value))
    page?: number = 1;

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Transform(({ value }) => (value === 0 ? 10 : value))
    limit?: number = 10;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;
}

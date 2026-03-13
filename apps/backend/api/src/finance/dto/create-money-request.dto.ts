import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import { ReportItemDto } from './report-item.request.dto';

export class CreateMoneyRequestDto {
    @ApiProperty()
    @IsString()
    date: string;

    @ApiProperty()
    @IsString()
    requestorName: string;

    @ApiProperty()
    @IsString()
    department: string;

    @ApiProperty({ type: [ReportItemDto] })
    @IsArray()
    @Type(() => ReportItemDto)
    items: ReportItemDto[];
}

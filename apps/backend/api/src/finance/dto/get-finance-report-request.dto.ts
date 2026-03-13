import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto3 } from '@shega/Utilities/models/paginated.request3';
import { Type } from 'class-transformer';
import {
    IsDefined,
    IsNotEmptyObject,
    IsObject,
    ValidateNested,
} from 'class-validator';

export class GetFinanceReportRequestDto {
    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto3)
    pagination: PaginationDto3;
}

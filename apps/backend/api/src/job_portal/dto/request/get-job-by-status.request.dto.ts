import { ApiProperty } from '@nestjs/swagger';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { PaginationDto } from '@shega/Utilities/models/paginated.request';
import { Type } from 'class-transformer';
import {
    IsDefined,
    IsEnum,
    IsNotEmptyObject,
    IsObject,
    IsOptional,
    ValidateNested,
} from 'class-validator';

export class GetJobsByStatusRequestDto {
    @ApiProperty()
    @IsEnum(ApprovalType)
    @IsOptional()
    status: ApprovalType;

    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto)
    pagination: PaginationDto;
}

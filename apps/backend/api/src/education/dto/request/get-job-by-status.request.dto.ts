import { ApiProperty } from '@nestjs/swagger';
import { OptionalEnum } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { PaginationDto } from '@shega/Utilities/models/paginated.request';
import { Type } from 'class-transformer';
import {
    IsDefined,
    IsNotEmptyObject,
    IsObject,
    ValidateNested,
} from 'class-validator';

export class GetJobsByStatusRequestDto {
    @ApiProperty()
    @OptionalEnum(ApprovalType)
    status: ApprovalType;

    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto)
    pagination: PaginationDto;
}

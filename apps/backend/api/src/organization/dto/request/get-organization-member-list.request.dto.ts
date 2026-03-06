import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@shega/Utilities/models/paginated.request';
import { Type } from 'class-transformer';
import {
    IsDefined,
    IsNotEmptyObject,
    IsObject,
    ValidateNested,
} from 'class-validator';

export class GetOrganizationMemberListRequestDto {
    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto)
    pagination: PaginationDto;
}

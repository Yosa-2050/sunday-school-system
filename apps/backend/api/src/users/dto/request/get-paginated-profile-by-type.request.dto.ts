import { ApiProperty } from '@nestjs/swagger';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
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

export class GetPaginatedProfileByTypeRequstDto {
    @ApiProperty()
    @IsEnum(UserRoleType)
    @IsOptional()
    status: UserRoleType;

    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto)
    pagination: PaginationDto;
}

import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@shega/Utilities/models/paginated.request';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
import { Transform, Type } from 'class-transformer';
import {
    IsDefined,
    IsEnum,
    IsNotEmptyObject,
    IsObject,
    IsOptional,
    ValidateNested,
} from 'class-validator';

export class GetPaginatedProfileByTypeRequstDto {
    @ApiProperty({ required: false }) // Not required in Swagger
    @IsEnum(UserRoleType)
    @IsOptional()
    @Transform(({ value }) => (value === '' ? null : value)) // Convert "" to null
    status?: UserRoleType | null;

    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto)
    pagination: PaginationDto;
}

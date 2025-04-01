import { ApiProperty } from '@nestjs/swagger';
import { LocationType } from '@shega/location/enums/location-type.enums';
import { ListStringRequestModel } from '@shega/Utilities/models/list-string.model';
import { IsEnum, IsUUID } from 'class-validator';

export class CreateLocationInfoRequestDto extends ListStringRequestModel {
    @ApiProperty()
    @IsUUID()
    countryId: string;

    @ApiProperty()
    @IsUUID()
    parentId: string;

    @ApiProperty()
    @IsEnum(LocationType)
    type: LocationType;
}

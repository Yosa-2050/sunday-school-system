import { ApiProperty } from '@nestjs/swagger';
import { OptionalUUID } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { ListStringRequestModel } from '@shega/Utilities/models/list-string.model';
import { LocationType } from '@shega/location/enums/location-type.enums';
import { IsEnum, IsUUID } from 'class-validator';

export class CreateLocationInfoRequestDto extends ListStringRequestModel {
    @ApiProperty()
    @IsUUID()
    countryId: string;

    @ApiProperty()
    @OptionalUUID()
    parentId: string;

    @ApiProperty()
    @IsEnum(LocationType)
    type: LocationType;
}

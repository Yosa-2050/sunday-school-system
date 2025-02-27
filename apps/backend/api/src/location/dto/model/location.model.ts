import { ApiProperty } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { AddressType } from '@shega/location/enums/address-type.enums';
import { IsBoolean, IsString } from 'class-validator';

export class LocationModel {
    referenceType: ReferenceType;

    @ApiProperty()
    @IsString()
    addressType: AddressType;

    @ApiProperty()
    @IsString()
    country: string;

    @ApiProperty()
    @IsString()
    region: string;

    @ApiProperty()
    @IsString()
    subcity: string;

    @ApiProperty()
    @IsString()
    city: string;

    @ApiProperty()
    @IsString()
    woreda: string;

    @ApiProperty()
    @IsString()
    village: string;

    @ApiProperty()
    @IsString()
    houseNumber: string;

    @ApiProperty()
    @IsString()
    addressText: string;

    @ApiProperty()
    @IsString()
    latitude: string;

    @ApiProperty()
    @IsString()
    longitude: string;

    @ApiProperty()
    @IsBoolean()
    isPreferred: boolean;
}

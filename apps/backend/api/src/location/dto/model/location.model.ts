import { ApiProperty } from '@nestjs/swagger';
import type { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
import type { AddressType } from '@shega/location/enums/address-type.enums';
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

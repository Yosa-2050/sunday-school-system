import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";
import { AddressType } from "src/location/enums/address-type.enums";
import { ReferenceType } from "src/Utilities/enums/reference-type.enum";

export class LocationModel{

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
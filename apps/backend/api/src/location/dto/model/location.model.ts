import { ApiProperty } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { AddressType } from '@shega/location/enums/address-type.enums';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class LocationModel {
    referenceType: ReferenceType;

    @ApiProperty()
    @IsString()
    addressType: AddressType;

    @ApiProperty()
    @IsString()
    @IsOptional()
    country: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    region: string;

    @ApiProperty()
    @IsString()
    subCity: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    city: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    woreda: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    village: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    houseNumber: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    addressText: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    latitude: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    longitude: string;

    @ApiProperty()
    @IsBoolean()
    isPreferred: boolean;
}

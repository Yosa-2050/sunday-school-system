import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsArray, ValidateNested } from "class-validator";
import { LocationModel } from "../model/location.model";
import { IndividualAddressDto } from "./create-address.dto";
import { Type } from "class-transformer";

export class ContactDetailsRequest{
    @IsDefined()
    @IsArray()
    @ApiProperty({ type: [IndividualAddressDto] })
    @ValidateNested({})
    @Type(() => IndividualAddressDto)
    phoneNumbers: IndividualAddressDto[];

    @IsDefined()
    @IsArray()
    @ApiProperty({ type: [IndividualAddressDto] })
    @ValidateNested({})
    @Type(() => IndividualAddressDto)
    emailAddress: IndividualAddressDto[];

    @IsDefined()
    @IsArray()
    @ApiProperty({ type: [IndividualAddressDto] })
    @ValidateNested({})
    @Type(() => IndividualAddressDto)
    otherAddress: IndividualAddressDto[];

    @IsDefined()
    @IsArray()
    @ApiProperty({ type: [LocationModel] })
    @ValidateNested({})
    @Type(() => LocationModel)
    location: LocationModel[];
}
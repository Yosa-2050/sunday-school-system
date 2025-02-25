import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDefined,
    IsEnum,
    IsString,
    ValidateNested,
} from 'class-validator';
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
import type { ContactType } from '@shega/location/enums/contact-type.enums';
import { ContactDetailsType } from '@shega/location/enums/contanct-details.type.enum';

export class IndividualAddressDto {
    @ApiProperty()
    @IsEnum(ContactDetailsType)
    type: ContactDetailsType;

    contactType: ContactType;

    @ApiProperty()
    @IsString()
    value: string;

    @ApiProperty()
    @IsBoolean()
    isPreferred: boolean;
}

export class CreateAddressDto {
    @ApiProperty()
    @IsString()
    referenceId: string;

    @ApiProperty()
    @IsEnum(ReferenceType)
    referenceType: ReferenceType;

    @IsDefined()
    @IsArray()
    @ValidateNested()
    @Type(() => IndividualAddressDto)
    @ApiProperty({ type: [IndividualAddressDto] })
    @ValidateNested({})
    addresses: IndividualAddressDto[];
}

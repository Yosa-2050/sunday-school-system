import { ApiProperty } from '@nestjs/swagger';
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
import { ContactType } from '@shega/location/enums/contact-type.enums';
import { ContactDetailsType } from '@shega/location/enums/contanct-details.type.enum';
import { EmalAddressType } from '@shega/location/enums/email-type.enums';
import { PhoneTypes } from '@shega/location/enums/phone-type.enums';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDefined,
    IsEnum,
    IsString,
    ValidateNested,
} from 'class-validator';

export class IndividualAddressDto {
    contactType: ContactType;

    @ApiProperty()
    @IsString()
    value: string;

    @ApiProperty()
    @IsBoolean()
    isPreferred: boolean;
}

export class EmailAddressDto extends IndividualAddressDto {
    @ApiProperty()
    @IsEnum(EmalAddressType)
    type: EmalAddressType;
}

export class PhoneNumberDto extends IndividualAddressDto {
    @ApiProperty()
    @IsEnum(PhoneTypes)
    type: PhoneTypes;
}

export class OtherAddressDto extends IndividualAddressDto {
    @ApiProperty()
    @IsEnum(ContactDetailsType)
    type: ContactDetailsType;
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

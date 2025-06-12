import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, ValidateNested } from 'class-validator';
import { LocationModel } from '../model/location.model';
import { EmailAddressDto, OtherAddressDto, PhoneNumberDto } from './create-address.dto';

export class ContactDetailsRequest {
    @IsDefined()
    @IsArray()
    @ApiProperty({ type: [PhoneNumberDto] })
    @ValidateNested({})
    @Type(() => PhoneNumberDto)
    phoneNumbers: PhoneNumberDto[];

    @IsDefined()
    @IsArray()
    @ApiProperty({ type: [EmailAddressDto] })
    @ValidateNested({})
    @Type(() => EmailAddressDto)
    emailAddress: EmailAddressDto[];

    @IsDefined()
    @IsArray()
    @ApiProperty({ type: [OtherAddressDto] })
    @ValidateNested({})
    @Type(() => OtherAddressDto)
    otherAddress: OtherAddressDto[];

}

export class LocationListRequest {
    @IsDefined()
    @IsArray()
    @ApiProperty({ type: [LocationModel] })
    @ValidateNested({})
    @Type(() => LocationModel)
    location: LocationModel[];
}

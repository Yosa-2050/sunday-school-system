import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDefined,
    IsNotEmptyObject,
    IsObject,
    IsString,
    ValidateNested,
} from 'class-validator';
import { ContactDetailsRequest } from '@shega/location/dto/request/contact-detail.request.dto';

export class CreateOrganizationDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    tinNumber: string;

    @ApiProperty()
    @IsString()
    displayName: string;

    @ApiProperty()
    @IsString()
    mainBranchName: string;

    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => ContactDetailsRequest)
    contactDetails: ContactDetailsRequest;
}

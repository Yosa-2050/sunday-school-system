import { ApiProperty } from '@nestjs/swagger';
import { ContactDetailsRequest } from '@shega/location/dto/request/contact-detail.request.dto';
import { Type } from 'class-transformer';
import {
    IsDefined,
    IsNotEmptyObject,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

export class CreateOrganizationDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    tinNumber?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    displayName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    mainBranchName?: string;

    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => ContactDetailsRequest)
    @IsOptional()
    contactDetails?: ContactDetailsRequest;
}

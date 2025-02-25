import { ApiProperty } from '@nestjs/swagger';
import { ContactDetailsRequest } from '@shega/location/dto/request/contact-detail.request.dto';
import { Type } from 'class-transformer';
import {
    IsDefined,
    IsNotEmptyObject,
    IsObject,
    IsString,
    ValidateNested,
} from 'class-validator';

export class AddOrganizationBranchDto {
    @ApiProperty()
    @IsString()
    branchName: string;

    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => ContactDetailsRequest)
    contactDetails: ContactDetailsRequest;
}

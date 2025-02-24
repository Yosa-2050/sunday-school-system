import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDefined,
    IsNotEmptyObject,
    IsObject,
    IsString,
    ValidateNested,
} from 'class-validator';
import { ContactDetailsRequest } from 'src/location/dto/request/contact-detail.request.dto';

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

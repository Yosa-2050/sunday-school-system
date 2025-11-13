import { ApiProperty } from '@nestjs/swagger';
import {
    OptionalEnum,
    OptionalUUID,
} from '@shega/Utilities/decorators/optional-uuid.decorator';
import { ContactDetailsRequest } from '@shega/location/dto/request/contact-detail.request.dto';
import { OrganizationMemberType } from '@shega/organization/enums/employee-type.enum';
import { NewProfileDto } from '@shega/users/dto/new-profile.dto';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
import { Type } from 'class-transformer';
import {
    IsDefined,
    IsEmail,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

export class CreateEmployeeDto extends NewProfileDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    password: string;

    @ApiProperty()
    @OptionalEnum(UserRoleType)
    role: UserRoleType;

    @ApiProperty()
    @IsDefined()
    @IsObject()
    @ValidateNested()
    @IsOptional()
    @Type(() => ContactDetailsRequest)
    contactDetails: ContactDetailsRequest;
}

export class CreateOrganizationUserDto {
    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    middleName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lastName: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;
}

export class CreateOrganizationEmployeeWithOrgDto extends CreateOrganizationUserDto {
    @ApiProperty()
    @IsString()
    organizationName: string;
}

export class CreateOrgEmployeeWithContactDto {
    @ApiProperty()
    @OptionalUUID()
    employeeOrgId: string;

    @ApiProperty()
    @IsString()
    phoneNumber: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    middleName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lastName: string;

    @ApiProperty()
    @OptionalEnum(OrganizationMemberType)
    position: OrganizationMemberType;
}

import { ApiProperty } from '@nestjs/swagger';
import { OptionalEnum } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { ContactDetailsRequest } from '@shega/location/dto/request/contact-detail.request.dto';
import { EmployeeType } from '@shega/organization/enums/employee-type.enum';
import { NewProfileDto } from '@shega/users/dto/new-profile.dto';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
import { Type } from 'class-transformer';
import {
    IsDefined,
    IsEmail,
    IsEnum,
    IsNotEmptyObject,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

export class CreateEmployeeDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    password: string;

    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => NewProfileDto)
    profile_dto: NewProfileDto;

    @ApiProperty()
    @IsEnum(UserRoleType)
    role: UserRoleType;

    @ApiProperty()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => ContactDetailsRequest)
    contactDetails: ContactDetailsRequest;
}

export class CreateOrganizationEmployeeDto {
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

export class CreateOrganizationEmployeeWithOrgDto extends CreateOrganizationEmployeeDto {
    @ApiProperty()
    @IsString()
    organizationName: string;
}

export class CreateOrgEmployeeWithContactDto {
    @ApiProperty()
    @IsString()
    phoneNumber: string;

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
    @OptionalEnum(EmployeeType)
    position: EmployeeType;
}

import { ApiProperty } from '@nestjs/swagger';
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
import { ContactDetailsRequest } from '@shega/location/dto/request/contact-detail.request.dto';
import { NewProfileDto } from '@shega/users/dto/new-profile.dto';
import { UserRoleType } from '@shega/users/enums/user-role.enum';

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

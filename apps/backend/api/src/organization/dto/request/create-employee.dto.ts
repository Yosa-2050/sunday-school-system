import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsEmail,
  IsArray,
} from "class-validator";
import { LocationModel } from "src/location/dto/model/location.model";
import { ContactDetailsRequest } from "src/location/dto/request/contact-detail.request.dto";
import { IndividualAddressDto } from "src/location/dto/request/create-address.dto";
import { NewProfileDto } from "src/users/dto/new-profile.dto";
import { UserRoleType } from "src/users/enums/user-role.enum";

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

import { ApiProperty } from '@nestjs/swagger';
import {
    IsDefined,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { Gender } from '../enums/profile-gender.enum';
import { MarriageStatus } from '../enums/profile-marriagestatus.enum';
import { Title } from '../enums/profile-title.enum';

export class NewProfileDto {
    @ApiProperty()
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    middleName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsOptional()
    mothersFullName?: string;

    @ApiProperty()
    @IsOptional()
    birthDate?: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @ApiProperty()
    @IsOptional()
    @IsEnum(MarriageStatus)
    marriageStatus?: MarriageStatus;

    @ApiProperty()
    @IsOptional()
    @IsEnum(Title)
    title?: Title;

    @ApiProperty()
    @IsOptional()
    @IsString()
    phoneNumber?: string;
}

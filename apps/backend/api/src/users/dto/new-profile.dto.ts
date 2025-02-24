import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';
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
    mothersFullName?: string;

    @ApiProperty()
    baptistName: string;

    @ApiProperty()
    birthDate: string;

    @ApiProperty()
    @IsEnum(Gender)
    gender?: Gender;

    @ApiProperty()
    @IsEnum(MarriageStatus)
    marriageStatus?: MarriageStatus;

    @ApiProperty()
    @IsEnum(Title)
    title?: Title;

    @ApiProperty()
    @IsString()
    phoneNumber: string;
}

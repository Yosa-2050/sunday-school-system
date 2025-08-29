import { ApiProperty } from '@nestjs/swagger';
import { OptionalEnum } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Gender } from '../enums/profile-gender.enum';
import { MarriageStatus } from '../enums/profile-marriage-status.enum';
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
    baptistName?: string;

    @ApiProperty()
    @OptionalEnum(Gender)
    gender?: Gender;

    @ApiProperty()
    @OptionalEnum(MarriageStatus)
    marriageStatus?: MarriageStatus;

    @ApiProperty()
    @OptionalEnum(Title)
    title?: Title;

    @ApiProperty()
    @IsOptional()
    @IsString()
    phoneNumber?: string;
}

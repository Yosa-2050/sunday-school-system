import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateApplicantRequestDto {
    @ApiProperty()
    @IsString()
    bio: string;

    @ApiProperty()
    @IsString()
    cv: string;

    @ApiProperty()
    @IsString()
    coverLetter: string;
}

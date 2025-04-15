import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateApplicantRequestDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    bio: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    coverLetter: string;
}

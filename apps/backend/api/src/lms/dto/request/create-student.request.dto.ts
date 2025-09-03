import { ApiProperty } from '@nestjs/swagger';
import { NewProfileDto } from '@shega/users/dto/new-profile.dto';
import { IsOptional, IsString } from 'class-validator';

export class CreateStudentRequestDto extends NewProfileDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    idNumber?: string;
}

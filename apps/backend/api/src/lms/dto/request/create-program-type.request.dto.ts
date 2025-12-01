import { ApiProperty } from '@nestjs/swagger';
import { ProgramType } from '@shega/lms/enums/program-type.enums';
import { IsEnum, IsString } from 'class-validator';

export class CreateProgramDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsEnum(ProgramType)
    programType: ProgramType;

    @ApiProperty()
    @IsString()
    description: string;
}

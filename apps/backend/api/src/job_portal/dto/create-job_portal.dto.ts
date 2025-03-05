import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { EmploymentType } from '../enums/employment-type.enum';


export class CreateJobPortalDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsEnum(EmploymentType)
    type: EmploymentType;

    @ApiProperty()
    @IsNumber()
    salaryFrom: number;

    @ApiProperty()
    @IsNumber()
    salaryTo: number;
}

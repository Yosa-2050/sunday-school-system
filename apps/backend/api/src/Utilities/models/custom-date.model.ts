import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { CalanderEnum } from '../enums/calander.enum';

export class CustomDateModel {
    @ApiProperty()
    @IsNumber()
    day: number;

    @ApiProperty()
    @IsNumber()
    month: number;

    @ApiProperty()
    @IsNumber()
    year: number;

    @ApiProperty()
    @IsNumber()
    hour: number;

    @ApiProperty()
    @IsNumber()
    minute: number;

    @ApiProperty()
    @IsNumber()
    second: number;

    @ApiProperty()
    @IsEnum(CalanderEnum)
    type: CalanderEnum;
}

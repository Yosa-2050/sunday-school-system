import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateEventAttendanceDto {
    @ApiProperty()
    @IsOptional()
    @IsDateString()
    date: Date;

    @ApiProperty()
    @IsString()
    startTime: string;

    @ApiProperty()
    @IsString()
    endTime: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean;
}

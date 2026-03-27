import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class AttendanceDetailDto {
    @IsString()
    referenceId: string;

    @IsOptional()
    @IsDateString()
    date: Date;

    @IsString()
    startTime?: string;

    @IsString()
    endTime?: string;

    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean;
}

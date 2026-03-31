import { AttendanceStatus } from '@shega/attendance/enums/attendance-status.enum';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class AttendanceDetailDto {
    @IsString()
    referenceId: string;

    @IsDateString()
    date: Date;

    @IsOptional()
    @IsString()
    startTime?: string;

    @IsOptional()
    @IsString()
    endTime?: string;

    @IsOptional()
    @IsString()
    remarks?: string;

    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean;
}

export class AttendanceDetailDataDto {
    @IsString()
    memberId: string;

    @IsString()
    referenceId: string;

    @IsEnum(AttendanceStatus)
    status: AttendanceStatus;

    @IsOptional()
    @IsString()
    remarks?: string;
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AttendanceStatus } from "@shega/attendance/enums/attendance-status.enum";
import { IsString, IsEnum, IsOptional } from "class-validator";

export class CreateAttendanceMemberDto {
  @ApiProperty()
  @IsString()
  memberId: string;

  @ApiPropertyOptional({ enum: AttendanceStatus })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string;
}

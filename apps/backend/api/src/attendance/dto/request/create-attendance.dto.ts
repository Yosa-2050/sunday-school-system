import { ApiProperty } from '@nestjs/swagger';
import { OptionalUUID } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { AttendanceStatus } from '@shega/attendance/enums/attendance-status.enum';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsDefined,
    IsEnum,
    IsUUID,
    ValidateNested,
} from 'class-validator';

export class StudentAttendance {
    @ApiProperty()
    @IsUUID()
    studentId: string;

    @ApiProperty()
    @OptionalUUID()
    subjectId: string;

    @ApiProperty()
    @OptionalUUID()
    teacherId: string;

    @ApiProperty()
    @IsEnum(AttendanceStatus)
    status: AttendanceStatus;
}

export class CreateAttendanceDto {
    @ApiProperty()
    @IsDate()
    @Transform(({ value }) => value && new Date(new Date(value).toUTCString()))
    date: Date;

    @ApiProperty()
    @OptionalUUID()
    subjectId: string;

    @ApiProperty()
    @OptionalUUID()
    teacherId: string;

    @IsDefined()
    @IsArray()
    @ValidateNested()
    @Type(() => StudentAttendance)
    @ApiProperty({ type: [StudentAttendance] })
    @ValidateNested({})
    attendance: StudentAttendance[];
}

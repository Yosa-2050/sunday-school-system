// biome-ignore lint/style/useImportType: <explanation>
import { AttendanceInformation } from '@shega/attendance/entities/attendance-data.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { Attendance } from '@shega/attendance/entities/attendance.entity';
import { AttendanceStatus } from '@shega/attendance/enums/attendance-status.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { StudentResponseDto } from '@shega/lms/dto/response/student.response.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { Gender } from '@shega/users/enums/profile-gender.enum';

export class AttendanceResponseDto {
    schedule_detail_id: string;
    date: Date;
    isPresent: boolean;
    isPermission: boolean;
    isLate: boolean;
    isAbsent: boolean;
    attendanceDataId: string;
    isNull: boolean;

    constructor(attendance: Attendance, data: AttendanceInformation) {
        if (attendance) {
            this.isAbsent = attendance.status === AttendanceStatus.Absent;
            this.isPresent = attendance.status === AttendanceStatus.Present;
            this.isPermission =
                attendance.status === AttendanceStatus.Permission;
            this.isLate = attendance.status === AttendanceStatus.Late;
            this.attendanceDataId = data.id;
            this.date = data.date;
            this.isNull = false;
        } else {
            this.isPermission = false;
            this.isPresent = false;
            this.attendanceDataId = data.id;
            this.date = data.date;
            this.isNull = true;
        }
    }
}

export class AttendanceStudentResponse {
    studentId: string;
    isStudentActive: boolean;
    idNumber: string;
    group: string;
    fullName: string;
    phoneNumber: string;
    totalPresent: number;
    totalPermission: number;
    totalAbsent: number;
    totalLate: number;
    lastSevenAttendance: AttendanceResponseDto[];
    gender: Gender;

    constructor(
        attendance: Attendance[],
        student: StudentResponseDto,
        data?: AttendanceInformation[],
    ) {
        if (student.isActive) {
            this.isStudentActive = student.isActive;
            this.idNumber = student.idNumber;
            this.studentId = student.id;
            //this.group = student.group;
            this.fullName = student.fullName;
            this.gender = student.gender;
            //this.phoneNumber = student.phoneNumber;
            this.totalPresent = attendance.filter(
                (x) => x.status === AttendanceStatus.Present,
            ).length;
            this.totalPermission = attendance.filter(
                (x) => x.status === AttendanceStatus.Permission,
            ).length;
            this.totalAbsent = attendance.filter(
                (x) => x.status === AttendanceStatus.Absent,
            ).length;
            this.totalLate = attendance.filter(
                (x) => x.status === AttendanceStatus.Late,
            ).length;

            // this.lastSevenAttendance = data.map((sliced) => {
            //   const att = attendance.find((x) => x.attendanceData?.id === sliced.id);
            //   return new AttendanceResponseDto(att, sliced);
            // });
        }
    }
}

export class AttendanceResponse {
    scheduleDays: AttendanceInformation[];
    attendances: AttendanceStudentResponse[];
}

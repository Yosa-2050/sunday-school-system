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
    date: Date;
    isPresent: boolean;
    isPermission: boolean;
    isLate: boolean;
    isAbsent: boolean;
    attendanceDataId: string;
    isNull: boolean;
    status: AttendanceStatus;

    constructor(attendance: Attendance, data: AttendanceInformation) {
        if (attendance) {
            this.status = attendance.status;
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
            this.attendanceDataId = '';
            this.isNull = true;
        }
    }
}

export class TotalAttendanceResponse {
    present: number;
    absent: number;
    late: number;
    permission: number;
}

export class AttendanceStudentResponse {
    studentId: string;
    isStudentActive: boolean;
    idNumber: string;
    group: string;
    fullName: string;
    phoneNumber: string;
    gender: Gender;
    totals: TotalAttendanceResponse;
    attendance: {
        [date: string]: AttendanceResponseDto;
    };

    constructor(
        attendance: Attendance[],
        student: StudentResponseDto,
        attendanceInfo: AttendanceInformation[],
    ) {
        if (student.isActive) {
            this.isStudentActive = student.isActive;
            this.idNumber = student.idNumber;
            this.studentId = student.id;
            //this.group = student.group;
            this.fullName = `${student.firstName} ${student.middleName} ${student.lastName}`;
            this.gender = student.gender;
            //this.phoneNumber = student.phoneNumber;
            this.totals = {
                present: attendance.filter(
                    (x) => x.status === AttendanceStatus.Present,
                ).length,
                permission: attendance.filter(
                    (x) => x.status === AttendanceStatus.Permission,
                ).length,
                absent: attendance.filter(
                    (x) => x.status === AttendanceStatus.Absent,
                ).length,
                late: attendance.filter(
                    (x) => x.status === AttendanceStatus.Late,
                ).length,
            };

            this.attendance = {};

            for (let index = 0; index < attendance.length; index++) {
                const element = attendance[index];
                const info = attendanceInfo.find(
                    (x) => x.id === element.attendanceDataId,
                );
                const dateStr = info?.date.toISOString().split('T')[0];
                this.attendance[dateStr] = new AttendanceResponseDto(
                    element,
                    info,
                );
            }
        }
    }
}

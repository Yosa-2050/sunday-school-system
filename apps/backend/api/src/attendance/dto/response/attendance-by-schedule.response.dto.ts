import { AttendanceInformation } from '@shega/attendance/entities/attendance-data.entity';
import { Attendance } from '@shega/attendance/entities/attendance.entity';
import { AttendanceStatus } from '@shega/attendance/enums/attendance-status.enum';
import { Gender } from '@shega/users/enums/profile-gender.enum';

export class ScheduleDetailAttResponseDto {
    studentId: string;
    isStudentActive: boolean;
    idNumber: string;
    group: string;
    fullName: string;
    phoneNumber: string;
    gender: Gender;
    isPresent: boolean;
    isAbsent: boolean;
    isLate: boolean;
    isPermission: boolean;
    status: AttendanceStatus;

    constructor(attendance: Attendance) {
        const student = attendance.student;
        this.isStudentActive = student.isActive;
        this.idNumber = student.idNumber;
        this.studentId = student.id;
        this.fullName = `${student.profile.firstName} ${student.profile.middleName} ${student.profile.lastName}`;
        this.gender = student.profile.gender;
        this.phoneNumber = student.profile.phoneNumber;
        this.isAbsent = attendance.status === AttendanceStatus.Absent;
        this.isPresent = attendance.status === AttendanceStatus.Present;
        this.isPermission = attendance.status === AttendanceStatus.Permission;
        this.isLate = attendance.status === AttendanceStatus.Late;
    }
}
export class AttendanceByScheduleDetailResponseDto {
    schedule_detail_id: string;
    date: Date;
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    totalPermission: number;
    attendance: ScheduleDetailAttResponseDto[];

    constructor(data: AttendanceInformation, attendanceArr: Attendance[]) {
        this.attendance = [];
        this.schedule_detail_id = data.id;
        this.date = data.date;
        for (let index = 0; index < attendanceArr.length; index++) {
            const element = attendanceArr[index];
            this.attendance.push(new ScheduleDetailAttResponseDto(element));
        }
        this.totalPresent = attendanceArr.filter(
            (x) => x.status === AttendanceStatus.Present,
        ).length;
        this.totalPermission = attendanceArr.filter(
            (x) => x.status === AttendanceStatus.Permission,
        ).length;
        this.totalAbsent = attendanceArr.filter(
            (x) => x.status === AttendanceStatus.Absent,
        ).length;
        this.totalLate = attendanceArr.filter(
            (x) => x.status === AttendanceStatus.Late,
        ).length;
    }
}

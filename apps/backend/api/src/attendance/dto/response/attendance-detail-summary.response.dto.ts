import { AttendanceDetail } from "@shega/attendance/entities/attendance-detail.entity";
import { Attendance } from "@shega/attendance/entities/attendance.entity";
import { AttendanceStatus } from "@shega/attendance/enums/attendance-status.enum";

export class AttendanceDetailSummaryResponseDto {
    id: string;
    referenceId: string;
    eventName?: string;
    date: Date;
    startTime?: string;
    endTime?: string;
    remarks?: string;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    total: number;
    present: number;
    absent: number;
    late: number;
    permission: number;

    constructor(
        detail: AttendanceDetail,
        attendance: Attendance[],
        eventName?: string,
    ) {
        this.id = detail.id;
        this.referenceId = detail.referenceId;
        this.eventName = eventName;
        this.date = detail.date;
        this.startTime = detail.startTime;
        this.endTime = detail.endTime;
        this.remarks = detail.remarks;
        this.isCompleted = detail.isCompleted;
        this.createdAt = detail.createdAt;
        this.updatedAt = detail.updatedAt;
        this.total = attendance.length;
        this.present = attendance.filter(
            (item) => item.status === AttendanceStatus.Present,
        ).length;
        this.absent = attendance.filter(
            (item) => item.status === AttendanceStatus.Absent,
        ).length;
        this.late = attendance.filter(
            (item) => item.status === AttendanceStatus.Late,
        ).length;
        this.permission = attendance.filter(
            (item) => item.status === AttendanceStatus.Permission,
        ).length;
    }
}

import { AttendanceInformation } from '@shega/attendance/entities/attendance-data.entity';

export class GraphPerDayArray {
    percentage: number;
    totalCount: number;
    totalPresent: number;
    schedule_detail_id: string;
    date: Date;
}
export class LineGraphPerDayReportByGroup {
    groupName: string;
    data: GraphPerDayArray[];
}
export class LineGraphPerDayReportByGroupList {
    attendanceData: AttendanceInformation[];
    result: LineGraphPerDayReportByGroup[];
}

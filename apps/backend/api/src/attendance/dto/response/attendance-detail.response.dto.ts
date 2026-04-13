import { AttendanceInformation } from '@shega/attendance/entities/attendance-data.entity';
import { AttendanceStudentResponse } from './attendance.response.dto';
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';

export class AttendanceDetailResponse {
    id: string;
    classId: string;
    className: string;
    subjectId: string;
    subjectName: string;
    teacherId?: string;
    teacherName?: string;
    date: string;
    isCompleted: boolean;
    totalStudents: number;
    presentCount: number;
    absentCount: number;

    constructor(data: AttendanceInformation, present: number, absent: number) {
        this.id = data.id;
        this.classId = data.class.id;
        this.className = data.class.name;
        this.subjectName = data.subject?.subjectTitle;
        this.isCompleted = data.isCompleted;
        this.date = data.date.toDateString();
        this.presentCount = present;
        this.absentCount = absent;
    }
}

export class PaginatedAttendanceStudentResponseDto   extends PaginatedResponseDto<
    AttendanceStudentResponse[]
> {}

// Add these types to your file or in a separate types file
export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    LATE = 'LATE',
    PERMISSION = 'PERMISSION',
}

export interface AttendanceRecord {
    studentId: string;
    status: AttendanceStatus;
    remarks?: string; // Optional if your API supports it
}

export interface AttendanceRequest {
    date: string; // ISO string format
    classId: string;
    sectionId?: string | null;
    subjectId: string;
    attendance: AttendanceRecord[];
}

export interface SavedDate {
    id: string;
    date: string;
    formattedDate: string;
    attendanceInfoId: string;
}

export interface AttendanceViewRequest {
    classId: string;
    attendanceInfoId?: string;
    startDate?: string;
    endDate?: string;

    page?: number;
  limit?: number;
  search?: string;
  status?: 'All' | 'Active' | 'InActive';
}

export interface AttendanceDetailViewRequest {
    classId?: string;
    subjectId?: string;
}

export interface AttendanceViewResponse {
    studentId: string;
    fullName: string;
    idNumber: string;
    attendance: {
        [date: string]: {
            status: AttendanceStatus;
            remarks?: string;
        };
    };
    totals: {
        present: number;
        absent: number;
        late: number;
        permission: number;
    };
}

export interface PaginatedAttendanceViewResponse {
  data: AttendanceViewResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface AttendanceDetailResponse {
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
}

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
    attendance: AttendanceRecord[];
}

export interface SavedDate {
    date: string;
    formattedDate: string;
    attendanceInfoId: string;
}

export interface AttendanceViewRequest {
    classId: string;
    sectionId?: string;
    startDate?: string;
    endDate?: string;
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

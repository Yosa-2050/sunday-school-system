import { fetcher } from '@shega/shared';
import type { SuccessResponse } from 'app/[locale]/_api/admin/fetch-programs';
// biome-ignore lint/style/useImportType: <explanation>
import { StudentResponse } from '../../students/schemas/fetchStudentDetail';

export const fetchAttendanceApi = async (
    classId: string,
): Promise<StudentResponse[]> => {
    const url = `/student/${classId}`;
    const response: StudentResponse[] = await fetcher(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

export const saveAttendanceApi = async (
    classId: string,
    attendanceData: AttendanceRequest,
): Promise<SuccessResponse> => {
    const response: SuccessResponse = await fetcher(`/attendance/${classId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
    });

    return response;
};

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

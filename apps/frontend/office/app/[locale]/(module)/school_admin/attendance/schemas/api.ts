import { fetcher } from '@shega/shared';
import type {
    IdSuccessResponse,
    SuccessResponse,
} from 'app/[locale]/_api/admin/fetch-programs';
// biome-ignore lint/style/useImportType: <explanation>
import { StudentResponse } from '../../students/schemas/type';
import type {
    AttendanceRecord,
    AttendanceRequest,
    AttendanceViewRequest,
    AttendanceViewResponse,
    SavedDate,
} from './types';

export const fetchAttendanceApi = async (
    classId: string,
): Promise<StudentResponse[]> => {
    const url = `/student/byClassId/${classId}`;
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
    const response: SuccessResponse = await fetcher(
        `/attendance/create/${classId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(attendanceData),
        },
    );

    return response;
};

export const saveIndividualAttendanceApi = async (
    classId: string,
    attendanceData: AttendanceRecord,
): Promise<IdSuccessResponse> => {
    const response: IdSuccessResponse = await fetcher(
        `/attendance/individual/${classId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(attendanceData),
        },
    );

    return response;
};

export const fetchSavedDatesApi = async (
    classId: string,
): Promise<SavedDate[]> => {
    const response: SavedDate[] = await fetcher(
        `/attendance/getDates/${classId}`,
    );
    return response;
};

export const fetchAttendanceViewApi = async (
    request: AttendanceViewRequest,
): Promise<AttendanceViewResponse[]> => {
    const response: AttendanceViewResponse[] = await fetcher(
        '/attendance/getAttendance',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        },
    );

    return response;
};

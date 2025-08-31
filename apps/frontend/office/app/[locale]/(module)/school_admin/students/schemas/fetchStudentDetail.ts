import { fetcher } from '@shega/shared';
import type { SuccessResponse } from 'app/[locale]/_api/admin/fetch-programs';

export const fetchStudentsApi = async (
    classId: string,
): Promise<StudentResponse[]> => {
    const url = `/student/${classId}`;
    const response: StudentResponse[] = await fetcher(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

export const importStudentsApi = async (
    file: File,
    classId: string,
): Promise<SuccessResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response: SuccessResponse = await fetcher(
        `/student/import/${classId}`,
        {
            method: 'POST',
            body: formData,
        },
    );

    return response;
};

export type StudentResponse = {
    id: string;
    fullName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    idNumber: string;
    isActive: boolean;
};

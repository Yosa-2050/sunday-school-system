import { fetcher } from '@shega/shared';
import type { IdSuccessResponse } from 'app/[locale]/_api/admin/fetch-programs';
import type { CreateStudentRequest } from '../../students/schemas/type';
import type { TeacherResponse } from './type';

export const fetchTeacherApi = async (): Promise<TeacherResponse[]> => {
    const response: TeacherResponse[] = await fetcher('/teacher');
    return response;
};

export const createTeacherApi = async ({
    data,
}: {
    data: CreateStudentRequest;
}): Promise<IdSuccessResponse> => {
    const response: IdSuccessResponse = await fetcher('/teacher/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response;
};

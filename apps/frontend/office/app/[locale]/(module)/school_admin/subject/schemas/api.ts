import { fetcher } from '@shega/shared';
import type { IdSuccessResponse } from 'app/[locale]/_api/admin/fetch-programs';
import type { CreateWithTextRequest, GetSubjectResponse } from './type';

export const fetchSubjectsApi = async (): Promise<GetSubjectResponse[]> => {
    const response: GetSubjectResponse[] = await fetcher('/subject/root');
    return response;
};

export const createSubjectApi = async (data: CreateWithTextRequest) => {
    const res: IdSuccessResponse = await fetcher('/subject/root', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res) {
        throw new Error('Failed to create subect');
    }
    return res;
};

export const updateSubjectApi = async (
    id: string,
    data: CreateWithTextRequest,
) => {
    const res: IdSuccessResponse = await fetcher(`/subject/root/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res) {
        throw new Error('Failed to update subect');
    }
    return res;
};

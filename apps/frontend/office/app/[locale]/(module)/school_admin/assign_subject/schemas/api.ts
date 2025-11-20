import { fetcher } from '@shega/shared';
import type { IdSuccessResponse } from 'app/[locale]/_api/admin/fetch-programs';
import type {
    CreateSubjectAssignmentRequest,
    SubjectAssignmentResponse,
} from './type';

export const createSubjectAssignmentApi = async (
    data: CreateSubjectAssignmentRequest,
    programId: string,
) => {
    const res: IdSuccessResponse = await fetcher(
        `/subject/assignSubject/${programId}`,
        {
            method: 'POST',
            body: JSON.stringify(data),
        },
    );
    if (!res) {
        throw new Error('Failed to create subject assignment');
    }
    return res;
};

export const updateSubjectAssignmentApi = async (
    data: CreateSubjectAssignmentRequest,
) => {
    const res: IdSuccessResponse = await fetcher(
        `/subject/assignSubject/${data.id}`,
        {
            method: 'PATCH',
            body: JSON.stringify(data),
        },
    );
    if (!res) {
        throw new Error('Failed to create subject assignment');
    }
    return res;
};

export const fetchSubjectsAssignmentApi = async (
    classId: string,
): Promise<SubjectAssignmentResponse[]> => {
    const response: SubjectAssignmentResponse[] = await fetcher(
        `/subject/assigned/${classId}`,
        {
            method: 'GET',
        },
    );
    return response;
};

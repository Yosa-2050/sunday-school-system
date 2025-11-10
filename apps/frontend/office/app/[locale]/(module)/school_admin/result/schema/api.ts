import { fetcher } from '@shega/shared';
import type { SuccessResponse } from 'app/[locale]/_api/admin/fetch-programs';
// biome-ignore lint/style/useImportType: <explanation>
import { StudentResponse } from '../../students/schemas/type';
import type { ResultRequest, ResultResponse, ResultViewResponse } from './type';

export const fetchResultApi = async (
    classId: string,
): Promise<StudentResponse[]> => {
    const url = `/student/byClassId/${classId}`;
    const response: StudentResponse[] = await fetcher(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

export const saveResultApi = async (
    resultData: ResultRequest,
): Promise<SuccessResponse> => {
    const response: SuccessResponse = await fetcher('/result/multiple', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData),
    });

    return response;
};

export const fetchResultViewApi = async (
    testId: string,
): Promise<ResultResponse[]> => {
    const url = `/result/byTest/${testId}`;
    const response: ResultResponse[] = await fetcher(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response;
};

export const dummyResultViewApi = async (
    classId: string,
    subjectId?: string,
    testId?: string,
): Promise<ResultViewResponse[]> => {
    const url = '/result/getResults';
    const response: ResultViewResponse[] = await fetcher(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testId, classId, subjectId }),
    });
    return response;
};

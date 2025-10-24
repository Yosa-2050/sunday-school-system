import { fetcher } from '@shega/shared';
import type { CreateTestRequest, TestResponse } from './type';

//export const CreateTest = async ()=> {
export const CreateTestApi = async (testData: CreateTestRequest) => {
    const response = await fetcher('/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
    });

    return response;
};

export const FetchTestBySubjectIdApi = async (
    subjectId: string,
): Promise<TestResponse[]> => {
    const response: TestResponse[] = await fetcher(
        `/test/bySubjectId/${subjectId}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        },
    );

    return response;
};

export const FetchTestByIdApi = async (id: string): Promise<TestResponse> => {
    const response: TestResponse = await fetcher(`/test/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

export const updateTestApi = async (
    id: string,
    body: CreateTestRequest,
): Promise<TestResponse> => {
    const response: TestResponse = await fetcher(`/test/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    return response;
};

export const DeleteTestApi = async (id: string) => {
    const response = await fetcher(`/test/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

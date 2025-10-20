import { fetcher } from '@shega/shared';
import type { TestResponse } from './type';

//export const CreateTest = async ()=> {
export const CreateTestApi = async (testData: {
    name: string;
    description?: string;
    type: string;
    weight: number;
    classId?: string;
    isGroupAssignment?: boolean;
}) => {
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

export const FetchTestByIdApi = async (id: string) => {
    const response = await fetcher(`/test/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

export const UpdateTestApi = async (
    id: string,
    testData: {
        name: string;
        description?: string;
        type: string;
        weight: number;
        classId?: string;
        isGroupAssignment?: boolean;
    },
) => {
    const response = await fetcher(`/test/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
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

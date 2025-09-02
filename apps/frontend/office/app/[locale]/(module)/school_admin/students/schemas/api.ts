import { fetcher } from '@shega/shared';
import type { SuccessResponse } from 'app/[locale]/_api/admin/fetch-programs';
import type {
    RelationShipsResponse,
    StudentByIdResponse,
    StudentResponse,
} from './type';

export const fetchStudentsApi = async (
    classId: string,
): Promise<StudentResponse[]> => {
    const url = `/student/byClassId/${classId}`;
    const response: StudentResponse[] = await fetcher(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

export const fetchStudentsIdApi = async (
    id: string,
): Promise<StudentByIdResponse> => {
    const url = `/student/byId/${id}`;
    const response: StudentByIdResponse = await fetcher(url, {
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

export const fetchRelationshipsApi = async (
    id: string,
): Promise<RelationShipsResponse[]> => {
    const url = `/profile/relatives/${id}`;
    const response: RelationShipsResponse[] = await fetcher(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

import { COOKIE_ACCESS_TOKEN, fetcher } from '@shega/shared';
import type { IdSuccessResponse } from 'app/[locale]/_api/admin/fetch-programs';
import { getCookie } from 'cookies-next';
import type {
    CreateRelationRequest,
    CreateStudentRequest,
    RelationShipsResponse,
    StudentByIdResponse,
    StudentResponse,
    UserResponse,
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

export const uploadFileApi = async (
    url: string,
    file: File,
): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = getCookie(COOKIE_ACCESS_TOKEN)?.toString();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ message: 'Upload failed', errors: [] }));
        
        const errObj: any = new Error(error.message || 'Failed to file');
        if (error.errors) {
            errObj.errors = error.errors;
        }
        throw errObj;
    }

    const data = await response.json();
    return data;
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

export const updateStudentApi = async ({
    studentId,
    data,
}: { studentId: string; data: any }) => {
    const response = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update student');
    }
    return response.json();
};

export const deleteRelationshipApi = async (relationshipId: string) => {
    const response = await fetch(`/api/relationships/${relationshipId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete relationship');
    }
    return response.json();
};

export const createStudentApi = async ({
    classId,
    studentData,
}: {
    classId?: string | null;
    studentData: CreateStudentRequest;
}): Promise<IdSuccessResponse> => {
    const response: IdSuccessResponse = await fetcher(
        `/student/create/${classId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
        },
    );
    return response;
};

export const createRelationshipApi = async ({
    profileId,
    relationshipData,
}: {
    profileId: string;
    relationshipData: CreateRelationRequest;
}): Promise<IdSuccessResponse> => {
    const response: IdSuccessResponse = await fetcher(
        `/student/create/${profileId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(relationshipData),
        },
    );
    return response;
};

export const searchProfilesApi = async (
    query: string,
): Promise<UserResponse[]> => {
    const response: UserResponse[] = await fetcher(
        '/organization-member/search',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: query }),
        },
    );
    return response;
};

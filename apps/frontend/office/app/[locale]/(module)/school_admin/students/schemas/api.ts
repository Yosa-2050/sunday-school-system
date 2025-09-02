import { fetcher } from '@shega/shared';
import type {
    IdSuccessResponse,
    SuccessResponse,
} from 'app/[locale]/_api/admin/fetch-programs';
import type {
    CreateRelationRequest,
    CreateStudentRequest,
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

export const updateStudentApi = async ({
    studentId,
    data,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
    classId: string;
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

export const searchProfilesApi = async (query: string) => {
    const response = await fetch(
        `/api/profiles/search?q=${encodeURIComponent(query)}`,
    );
    if (!response.ok) {
        throw new Error('Failed to search profiles');
    }
    return response.json();
};

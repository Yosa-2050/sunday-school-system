import { fetcher } from '@shega/shared';

export type MentorResponse = {
    total: number;
    totalPages: number;
};

export type Users = {
    id: string;
    firstName: string;
    lastName: string;
    userType: string;
    status: string;
    email: string;
    createdBy: string;
    createdAt: string;
};

export type FetchUsersPayload = {
    search: string;
    page: number;
    limit: number;
};

export interface Response {
    id: string;
    createdAt: string;
    isActive: boolean;
    createdBy: string;
    status: string;
    note: any;
    profile: {
        id: string;
        createdAt: string;
        isActive: boolean;
        firstName: string;
        middleName: string;
        lastName: string;
        mothersFullName: null;
        birthDate: null;
        dobGregorian: null;
        gender: null;
        marriageStatus: null;
        title: null;
        phoneNumber: null;
        profile_picture_id: null;
    };
}

export const fetchMentorship = async (q: string) => {
    const response: { data: Response[]; total: number } = await fetcher(
        '/mentorship/allMentors',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q }),
        },
    );

    return response;
};

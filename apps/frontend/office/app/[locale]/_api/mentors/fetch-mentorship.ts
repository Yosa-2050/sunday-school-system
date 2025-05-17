import { fetcher } from '@shega/shared';

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
    status: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

export const fetchMentorship = async () => {
    const response: Response[] = await fetcher('/mentorship/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

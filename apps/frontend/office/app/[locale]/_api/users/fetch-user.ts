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

export const fetchUsers = async () => {
    const response: Users[] = await fetcher('/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

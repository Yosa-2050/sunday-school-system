import { fetcher } from '@shega/shared';

export type CreateUsers = {
    role: string;
    email: string;
    firstName: string;
    middleName: string;
    lastName: string;
    organizationName?: string;
};

export const createUsers = async (data: CreateUsers) => {
    const response: CreateUsers[] = await fetcher(data.role === 'WORK_PROVIDER' ? '/organization/createEmployee' : '/profile/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return response;
};

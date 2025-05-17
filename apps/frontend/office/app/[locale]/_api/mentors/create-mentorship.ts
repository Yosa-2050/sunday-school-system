import { fetcher } from '@shega/shared';

export type CreateMentorsProps = {
    email: string;
    firstName: string;
    middleName: string;
    lastName: string;
};

export const createMentors = async (data: CreateMentorsProps) => {
    const response: CreateMentorsProps[] = await fetcher(
        '/mentorship/newUser',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        },
    );

    return response;
};

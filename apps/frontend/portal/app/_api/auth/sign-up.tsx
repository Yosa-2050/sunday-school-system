import { fetcher } from '@shega/shared';

type ChangePassword = {
    userId: string;
    oldPassword: string;
    newPassword: string;
};

export const changePassword = async (data: ChangePassword) => {
    const response: Response = await fetcher('/auth/changePassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return response;
};

import { fetcher } from '@shega/shared';

type LoginRequest = {
    username: string;
    origin?: string;
};

export type Data = {
    role: string;
    email: string;
    access_token: string;
    pwdChangeRequired: boolean;
    id: string;
};

export type Response = {
    success: true;
};

export const resetPassword = async (data: LoginRequest) => {
    data.origin = "office";
    const response: Response = await fetcher('/auth/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return response;
};

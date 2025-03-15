import { fetcher } from '@shega/shared';

export type ConfirmResetPasswordRequest = {
    username: string;
    password: string;
    otp: string;
    origin: 'office';
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

export const confirmResetPassword = async (
    data: ConfirmResetPasswordRequest,
) => {
    const response: Response = await fetcher('/auth/validateResetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return response;
};

import { fetcher } from '@shega/shared';
import type { RoleEnum } from 'node_modules/@shega/shared/src/types/role';

type LoginRequest = {
    username: string;
    password: string;
    origin: 'office';
};

export type Data = {
    role: RoleEnum;
    email: string;
    access_token: string;
    pwdChangeRequired: boolean;
    id: string;
    details: {
        organizationId: string;
    };
};

export type Response = {
    data: Data;
};

export const login = async (data: LoginRequest) => {
    const response: Response = await fetcher('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return response;
};

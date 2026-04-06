import { fetcher } from '@shega/shared';
import type { RoleEnum } from '@shega/shared';

type LoginRequest = {
    username: string;
    password: string;
    origin: 'office';
    role?: string;
};

export type Data = {
    allRoles: RoleEnum[];
    selectRole: boolean;
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

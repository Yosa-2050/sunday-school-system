import { fetcher } from '@shega/shared';
import type { Organization } from 'model/Organization';

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
    data: Daum[];
    total: number;
    limit: number;
    page: number;
    totalPages: number;
}

export interface Daum {
    id: string;
    createdBy: string;
    createdDate: string;
    isActive: boolean;
    name: string;
    status: string;
}

export const fetchOrganizations = async (payload: string) => {
    const response: Response = await fetcher('/organization/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: payload }),
    });

    return response;
};

export const fetchOrganizationsUsingGet = async () => {
    const response: Organization[] = await fetcher('/organization/all', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

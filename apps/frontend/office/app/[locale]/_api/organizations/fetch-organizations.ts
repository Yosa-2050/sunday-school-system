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
    data: Daum[]
    total: number
    limit: number
    page: number
    totalPages: number
  }
  
  export interface Daum {
    createdBy: string
    createdDate: string
    isActive: boolean
    name: string
  }
  

export const fetchOrganizations = async (payload: FetchUsersPayload) => {
    const response: Response = await fetcher('/organization/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return response;
};

import { fetcher } from '@shega/shared';

export type CreateOrganizations = {
    role: string;
    email: string;
    firstName: string;
    middleName: string;
    lastName: string;
    organizationName?: string;
};

export const CreateOrganizations = async (data: CreateOrganizations) => {const response: CreateOrganizations[] = await fetcher('/organization/createEmployee',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        },
    );

    return response;
};

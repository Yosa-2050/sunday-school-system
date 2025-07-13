import { COOKIE_ACCESS_TOKEN, fetcher } from '@shega/shared';
import { getCookie } from 'cookies-next';

export const submitContactPerson = async (data: {
    phoneNumber: string;
    firstName: string;
    middleName?: string;
    lastName?: string;
    position: string;
}) => {
    const token = getCookie(COOKIE_ACCESS_TOKEN)?.toString();
    if (!token) {
        throw new Error('Unauthorized: No access token found.');
    }

    const response = await fetcher('/organization/contactPerson', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: '*/*',
        },
        body: JSON.stringify(data),
    });

    return response;
};

export const updateContactPerson = async (
    id: string,
    data: {
        phoneNumber: string;
        firstName: string;
        middleName?: string;
        lastName?: string;
        position: string;
    },
) => {
    const token = getCookie(COOKIE_ACCESS_TOKEN)?.toString();
    if (!token) {
        throw new Error('Unauthorized: No access token found.');
    }

    const response = await fetcher(`/organization/contactPerson/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: '*/*',
        },
        body: JSON.stringify(data),
    });

    return response;
};

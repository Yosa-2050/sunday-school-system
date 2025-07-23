import { fetcher } from '@shega/shared';

export const approveOrganization = async (id: string) => {
    const response = await fetcher(`/organization/approve/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
    });

    return { response };
};
export const declineOrganization = async (id: string, note: string) => {
    const response = await fetcher(`/organization/decline/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
    });

    return response;
};

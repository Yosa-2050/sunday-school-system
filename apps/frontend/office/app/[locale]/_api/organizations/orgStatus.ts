import { fetcher } from '@shega/shared';

export const activateOrg = async (id: string) => {
    return await fetcher(`/organization/activate/${id}/true`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    });
};

export const deactivateOrg = async (id: string, reason: string) => {
    return await fetcher(`/organization/deactivate/${id}/true`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: reason }),
    });
};

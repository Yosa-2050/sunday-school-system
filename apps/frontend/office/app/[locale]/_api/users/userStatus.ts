import { fetcher } from '@shega/shared';

export const activateUser = async (id: string) => {
    return await fetcher(`/users/activate/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    });
};

export const deactivateUser = async (id: string) => {
    return await fetcher(`/users/deactivate/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    });
};

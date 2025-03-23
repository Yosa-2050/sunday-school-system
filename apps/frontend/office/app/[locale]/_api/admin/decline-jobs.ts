import { fetcher } from '@shega/shared';

export const declineJob = async (id: string) => {
    const response = await fetcher(`/job-portal/decline/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

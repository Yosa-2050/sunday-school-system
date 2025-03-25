import { fetcher } from '@shega/shared';

export const declineJob = async (id: string, declineReason: string) => {
    const response = await fetcher(`/job-portal/decline/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            declineReason,
        }),
    });

    return response;
};

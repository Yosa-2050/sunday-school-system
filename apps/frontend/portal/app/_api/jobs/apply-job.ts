import { fetcher } from '@shega/shared';

export const applyJobs = async (id: string) => {
    const response = await fetcher(`/job-seeker/apply/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
    });

    return response;
};

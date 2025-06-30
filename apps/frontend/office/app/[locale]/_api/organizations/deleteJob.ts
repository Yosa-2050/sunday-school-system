import { fetcher } from '@shega/shared';

export const deleteJob = async (jobId: string) => {
    const response = await fetcher(`/job-portal/${jobId}`, {
        method: 'DELETE',
    });

    return response as { name: string };
};

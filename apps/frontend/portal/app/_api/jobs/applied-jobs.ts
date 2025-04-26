import { fetcher } from '@shega/shared';

export const appliedJobs = async () => {
    const response = await fetcher('/job-seeker/jobs/appliedBySeeker', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

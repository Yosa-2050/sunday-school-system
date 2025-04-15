import type { JobSeeker } from '@/models/job-seeker.type';
import { fetcher } from '@shega/shared';

export const jobSeekerDetails = async (): Promise<JobSeeker> => {
    return await fetcher<JobSeeker>('/job-seeker/details');
};

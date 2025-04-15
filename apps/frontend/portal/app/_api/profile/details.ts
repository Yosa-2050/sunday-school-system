import { fetcher } from '@shega/shared';
import type { JobSeeker } from '@/models/job-seeker.type';

export const jobSeekerDetails = async (): Promise<JobSeeker> => {
    return await fetcher<JobSeeker>('/job-seeker/details');
};

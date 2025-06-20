import { fetcher } from '@shega/shared';

const applicantDetails = (id: string) => {
    return fetcher(`/job-seeker/detail/s${id}`, {
        method: 'GET',
        headers: { accept: '*/*' },
    });
};
export { applicantDetails };

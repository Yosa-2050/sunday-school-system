import { fetcher } from '@shega/shared';

export interface Response {
    totalRegisteredUsers: number;
    totalRegisteredMentors: number;
    totalRegisteredEmployer: number;
    totalRegisteredJobSeekers: number;
    totalRegisteredAdmin: number;
    totalPostedJobs: number;
    totalMentorshipprogram: number;
}

export const fetchReportAdmin = async (): Promise<Response> => {
    const response: Response = await fetcher('/admin-report/getCountTotals', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

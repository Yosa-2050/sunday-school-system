import { fetcher } from '@shega/shared';
import type { jobTypes } from 'constants/job-type';

export type FetchJob = {
    search: string;
    page: number;
    limit: number;
};

export type Response = {
    data: Array<{
        experienceLevel: string;
        id: string;
        isActive: boolean;
        title: string;
        description: string;
        type: keyof typeof jobTypes;
        salaryFrom: number;
        salaryTo: number;
        status: string;
        currency: string;
        createdAt: string;
        applied: boolean;
        organization: {
            id: string;
            isActive: boolean;
            name: string;
            description: null;
            tinNumber: null;
            displayName: null;
            hasBranches: boolean;
        };
        postedBy: {
            id: string;
            isActive: boolean;
            type: string;
            employee: {
                id: string;
                isActive: boolean;
                id_number: null;
                profile: {
                    id: string;
                    isActive: boolean;
                    firstName: string;
                    middleName: string;
                    lastName: string;
                    mothersFullName: null;
                    birthDate: null;
                    dobGregorian: null;
                    gender: null;
                    marriageStatus: null;
                    title: null;
                    phoneNumber: null;
                    profile_picture_id: null;
                };
            };
        };
    }>;
    total: number;
    limit: number;
    page: number;
    totalPages: number;
};

export type Filter = {
    title?: string;
    categoryId?: string;
    organizationId?: string;
    cityId?: string;
    type?: string;
    experianceLevel?: string;
    salaryFrom?: number;
    salaryTo?: number;
    pagination: Pagination;
};

export interface Pagination {
    status?: string;
    search?: string;
    page: number;
    limit: number;
}

export const fetchJobs = async (data: Filter) => {
    const response = await fetcher('/job-seeker/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return response as Response;
};

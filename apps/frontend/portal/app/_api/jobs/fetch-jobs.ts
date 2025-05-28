import { fetcher } from '@shega/shared';
import type { jobTypes } from 'constants/job-type';

export type FetchJob = {
    search: string;
    page: number;
    limit: number;
};

export type Response = {
    data: Array<{
        experianceLevel: string;
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
        createdDate: string;
        postedDate: string | null;
        saved: boolean;
        programId: string;
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
    countryId?: string;
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
    const cleanedData = Object.entries(data).reduce(
        (acc, [key, value]) => {
            if (key === 'pagination') {
                acc[key] = Object.entries(value).reduce(
                    (pAcc, [pKey, pValue]) => {
                        if (
                            pValue !== undefined &&
                            pValue !== null &&
                            pValue !== ''
                        ) {
                            pAcc[pKey] = pValue;
                        }
                        return pAcc;
                    },
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    {} as Record<string, any>,
                );
            } else if (value !== undefined && value !== null && value !== '') {
                acc[key] = value;
            }
            return acc;
        },
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        {} as Record<string, any>,
    );

    const response = await fetcher('/job-seeker/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
    });

    return response as Response;
};

export const likeJob = async (programId: string) => {
    const response = await fetcher(`/job-seeker/saveProgram/${programId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    return response as { success: boolean; message: string };
};

export const unlikeJob = async (programId: string) => {
    const response = await fetcher(`/job-seeker/unsaveProgram/${programId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response as { success: boolean; message: string };
};

export const fetchSavedJobs = async () => {
    const response = await fetcher('/job-seeker/getSavedPrograms', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return response as Response;
};

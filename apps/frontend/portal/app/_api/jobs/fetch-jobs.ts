import { fetcher } from '@shega/shared';
export type FetchJob = {
    search: string;
    page: number;
    limit: number;
};

export type ResponseItem = {
    id: string;
    createdDate: string;
    postedDate: string;
    status: string;
    title: string;
    description: string;
    note: string;
    isPublished: boolean;
    applied: boolean;
    saved: boolean;
    programId: string;
    experianceLevel: string;
    type: string;
};

export type Response = {
    data: Array<ResponseItem>;
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

    const response = await fetcher('/job-seeker/programs', {
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

export const fetchSavedJobs = async (payload: Pagination) => {
    const response = await fetcher(
        `/job-seeker/getSavedPrograms?page=${payload.page}&limit=${payload.limit}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        },
    );
    return response as Response;
};

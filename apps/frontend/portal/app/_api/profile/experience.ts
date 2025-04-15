import type { Experience } from '@/lib/types';
import { fetcher } from '@shega/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Types for the API payload
export type ExperiencePayload = {
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    type: string;
    countryId: string;
    stateId: string;
    cityId: string;
    workPlace: string;
};

// API functions
export const getExperiences = async (): Promise<Experience[]> => {
    return await fetcher<Experience[]>('/job-seeker/experiance');
};

export const addExperience = async (
    payload: ExperiencePayload,
): Promise<Experience> => {
    return await fetcher<Experience>('/job-seeker/experiance', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const updateExperience = async (
    id: string,
    payload: ExperiencePayload,
): Promise<Experience> => {
    return await fetcher<Experience>(`/job-seeker/experiance/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
};

export const deleteExperience = async (id: string): Promise<void> => {
    return await fetcher(`/job-seeker/experiance/${id}`, {
        method: 'DELETE',
    });
};

// React Query hooks
export const useExperiences = () => {
    return useQuery({
        queryKey: ['experiences'],
        queryFn: getExperiences,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
};

export const useAddExperience = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addExperience,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

export const useUpdateExperience = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: { id: string; payload: ExperiencePayload }) =>
            updateExperience(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiences'] });
        },
    });
};

export const useDeleteExperience = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteExperience,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiences'] });
        },
    });
};

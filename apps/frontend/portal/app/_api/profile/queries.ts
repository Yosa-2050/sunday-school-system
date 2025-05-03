import type { JobSeeker, Profile } from '@/models/job-seeker.type';
import { COOKIE_ACCESS_TOKEN, fetcher } from '@shega/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { jobSeekerDetails } from './details';

export const useJobSeekerDetails = () => {
    return useQuery<JobSeeker>({
        queryKey: ['jobSeekerDetails'],
        queryFn: jobSeekerDetails,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
};

// Skills
export const fetchSkills = async (): Promise<string[]> => {
    const response = await fetcher<{ list: string[] }>('/job-seeker/skills', {
        method: 'GET',
        headers: { accept: '*/*' },
    });

    if (!response) {
        throw new Error('Failed to fetch skills');
    }

    return response.list;
};

export const updateSkills = async (skills: string[]): Promise<string[]> => {
    const response = await fetcher<{ list: string[] }>('/job-seeker/skills', {
        method: 'POST',
        headers: { accept: '*/*' },
        body: JSON.stringify({ list: skills }),
    });

    if (!response) {
        throw new Error('Failed to update skills');
    }

    return response.list;
};

// Skills hooks
export const useSkills = () => {
    return useQuery({
        queryKey: ['skills'],
        queryFn: fetchSkills,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
};

export const useUpdateSkills = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSkills,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

// Education
export type Education = {
    id: string;
    school: string;
    level: string;
    fieldOfStudyId: string;
    startDate: string;
    endDate: string;
    grade: number;
    description: string;
};

// Alias for backward compatibility
export type EducationalHistory = Education;

export const fetchEducation = async (): Promise<Education[]> => {
    const response = await fetcher<Education[]>(
        '/job-seeker/educationalHistory',
        {
            method: 'GET',
            headers: { accept: '*/*' },
        },
    );

    if (!response) {
        throw new Error('Failed to fetch education history');
    }

    return response;
};

export const createEducation = async (
    education: Omit<Education, 'id'>,
): Promise<Education> => {
    const response = await fetcher<Education>(
        '/job-seeker/educationalHistory',
        {
            method: 'POST',
            headers: { accept: '*/*' },
            body: JSON.stringify(education),
        },
    );

    if (!response) {
        throw new Error('Failed to create education');
    }

    return response;
};

export const updateEducation = async (
    education: Education,
): Promise<Education> => {
    const response = await fetcher<Education>(
        `/job-seeker/educationalHistory/${education.id}`,
        {
            method: 'PUT',
            headers: { accept: '*/*' },
            body: JSON.stringify(education),
        },
    );

    if (!response) {
        throw new Error('Failed to update education');
    }

    return response;
};

export const deleteEducation = async (id: string): Promise<void> => {
    const response = await fetcher<void>(
        `/job-seeker/educationalHistory/${id}`,
        {
            method: 'DELETE',
            headers: { accept: '*/*' },
        },
    );
};

// Education hooks
export const useEducation = () => {
    return useQuery({
        queryKey: ['education'],
        queryFn: fetchEducation,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
};

export const useCreateEducation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEducation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

export const useUpdateEducation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateEducation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

export const useDeleteEducation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteEducation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

// CV Upload
export const uploadCV = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = getCookie(COOKIE_ACCESS_TOKEN)?.toString();

    // Use native fetch to have full control over the request
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/job-seeker/upload/cv`,
        {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            // Don't set Content-Type - browser will set it with boundary
        },
    );

    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ message: 'Upload failed' }));
        throw new Error(error.message || 'Failed to upload CV');
    }

    const data = await response.json();
    return data;
};

export const useUploadCV = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadCV,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

// Profile Picture Upload
export const uploadProfilePicture = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = getCookie(COOKIE_ACCESS_TOKEN)?.toString();

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/upload/profilePicture`,
        {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ message: 'Upload failed' }));
        throw new Error(error.message || 'Failed to upload profile picture');
    }

    const data = await response.json();
    return data;
};

export const useUploadProfilePicture = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadProfilePicture,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

export const downloadProfilePicture = async (id: string): Promise<Blob> => {
    const token = getCookie(COOKIE_ACCESS_TOKEN)?.toString();
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/document/${id}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                accept: '*/*',
            },
        },
    );

    if (!response.ok) {
        throw new Error('Failed to download profile picture');
    }

    return response.blob();
};

export const useDownloadProfilePicture = (id: string) => {
    return useQuery({
        queryKey: ['profilePicture', id],
        queryFn: () => downloadProfilePicture(id),
        enabled: !!id, // Only enable the query if id is truthy
    });
};

// Field of Study
export type FieldOfStudy = {
    id: string;
    isActive: boolean;
    name: string;
    type: string;
    isRoot: boolean;
    hasChild: boolean;
};

export const fetchFieldsOfStudy = async (): Promise<FieldOfStudy[]> => {
    const response = await fetcher<FieldOfStudy[]>('/job-detail/categories', {
        method: 'GET',
        headers: { accept: '*/*' },
    });

    if (!response) {
        throw new Error('Failed to fetch fields of study');
    }

    return response;
};

export const useFieldsOfStudy = () => {
    return useQuery({
        queryKey: ['fieldsOfStudy'],
        queryFn: fetchFieldsOfStudy,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
};

// Education Level
export type EducationLevel = {
    key: string;
    value: string;
};

export const fetchEducationLevels = async (): Promise<EducationLevel[]> => {
    const response = await fetcher<{ data: Record<string, string> }>(
        '/enums/EducationalRequirmentType',
        {
            method: 'GET',
            headers: { accept: '*/*' },
        },
    );

    if (!response?.data) {
        throw new Error('Failed to fetch education levels');
    }

    return Object.entries(response.data).map(([key, value]) => ({
        key,
        value,
    }));
};

export const useEducationLevels = () => {
    return useQuery({
        queryKey: ['educationLevels'],
        queryFn: fetchEducationLevels,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
};

// Bio and Cover Letter
export const updateBio = async (bio: string): Promise<void> => {
    await fetcher<void>('/job-seeker/detail', {
        method: 'PATCH',
        headers: { accept: '*/*' },
        body: JSON.stringify({ bio }),
    });
};

export const updateHeadline = async (headline: string): Promise<void> => {
    await fetcher<void>('/job-seeker/detail', {
        method: 'PATCH',
        headers: { accept: '*/*' },
        body: JSON.stringify({ headline }),
    });
};
export const updateCoverLetter = async (coverLetter: string): Promise<void> => {
    await fetcher<void>('/job-seeker/detail', {
        method: 'PATCH',
        headers: { accept: '*/*' },
        body: JSON.stringify({ coverLetter }),
    });
};

export const useUpdateBio = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateBio,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

export const useUpdateHeadline = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateHeadline,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

export const useUpdateCoverLetter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCoverLetter,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

// Update individual educational history entry
export const updateEducationalHistoryEntry = async (
    id: string,
    data: Partial<EducationalHistory>,
): Promise<void> => {
    await fetcher<void>(`/job-seeker/educationalHistory/${id}`, {
        method: 'PATCH',
        headers: { accept: '*/*' },
        body: JSON.stringify(data),
    });
};

export const useUpdateEducationalHistoryEntry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: Partial<EducationalHistory>;
        }) => updateEducationalHistoryEntry(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

// Experience
export type Experience = {
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    type: string;
    countryId: string;
    regionId: string;
    cityId: string;
    workPlace: string;
};

export const fetchExperience = async (): Promise<Experience[]> => {
    const response = await fetcher<Experience[]>('/job-seeker/experience', {
        method: 'GET',
        headers: { accept: '*/*' },
    });

    if (!response) {
        throw new Error('Failed to fetch experience');
    }

    return response;
};

export const createExperience = async (
    experience: Omit<Experience, 'id'>,
): Promise<Experience> => {
    const response = await fetcher<Experience>('/job-seeker/experience', {
        method: 'POST',
        headers: { accept: '*/*' },
        body: JSON.stringify(experience),
    });

    if (!response) {
        throw new Error('Failed to create experience');
    }

    return response;
};

export const updateExperienceEntry = async (
    experience: Experience,
): Promise<Experience> => {
    const response = await fetcher<Experience>(
        `/job-seeker/experience/${experience.id}`,
        {
            method: 'PUT',
            headers: { accept: '*/*' },
            body: JSON.stringify(experience),
        },
    );

    if (!response) {
        throw new Error('Failed to update experience');
    }

    return response;
};

export const deleteExperienceEntry = async (id: string): Promise<void> => {
    const response = await fetcher<void>(`/job-seeker/experience/${id}`, {
        method: 'DELETE',
        headers: { accept: '*/*' },
    });
};

// Experience hooks
export const useExperience = () => {
    return useQuery({
        queryKey: ['experience'],
        queryFn: fetchExperience,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
};

export const useCreateExperience = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createExperience,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

export const useUpdateExperienceEntry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateExperienceEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

export const useDeleteExperience = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteExperienceEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

// Employment and Workplace Types
export type EnumValue = {
    key: string;
    value: string;
};

export const fetchEnum = async (type: string): Promise<EnumValue[]> => {
    const response = await fetcher<EnumValue[]>(`/enum/${type}`, {
        method: 'GET',
        headers: { accept: '*/*' },
    });

    if (!response) {
        throw new Error(`Failed to fetch ${type} enum values`);
    }

    return response;
};

export const useEmploymentTypes = () => {
    return useQuery({
        queryKey: ['employmentTypes'],
        queryFn: () => fetchEnum('employmentType'),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
};

export const useWorkplaceTypes = () => {
    return useQuery({
        queryKey: ['workplaceTypes'],
        queryFn: () => fetchEnum('workplaceType'),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
};

const updateProfile = (data: Partial<Profile>, id: string) => {
    return fetcher(`/profile/${id}`, {
        body: JSON.stringify(data),
        method: 'PATCH',
    });
};

export const useUpdateProfile = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Profile>) => updateProfile(data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

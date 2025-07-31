import { notifications } from '@mantine/notifications';
import { COOKIE_ACCESS_TOKEN, fetcher } from '@shega/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Base entity interface
interface BaseEntity {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
}

// User account information
interface User {
    email: string;
    email_confirmed: boolean;
    userName: string;
    note?: string;
}

// Field of study for education
interface FieldOfStudy {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    name: string;
    isRoot: boolean;
    hasChild: boolean;
}

// Work experience
interface Experience extends BaseEntity {
    title: string;
    company: string;
    startDate: string;
    endDate: string | null;
    type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
    workPlace: 'REMOTE' | 'ON_SITE' | 'HYBRID';
    country: string | null;
    state: string | null;
    city: string | null;
}

// Educational history
interface EducationalHistory extends BaseEntity {
    school: string;
    level: 'BSC' | 'MSC' | 'PHD' | 'DIPLOMA' | 'CERTIFICATE' | 'HIGH_SCHOOL';
    startDate: string;
    endDate: string;
    grade: number;
    description: string;
    fieldOfStudy: FieldOfStudy;
}

// Skills
interface Skill extends BaseEntity {
    skill: string;
}

// Personal profile information
interface Profile extends BaseEntity {
    firstName: string;
    middleName: string | null;
    lastName: string;
    mothersFullName: string | null;
    birthDate: string;
    dobGregorian: string | null;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    marriageStatus: string | null;
    title: string;
    phoneNumber: string;
    profile_picture_id: string;
}

// Main applicant interface
export interface ApplicantDetails extends BaseEntity {
    email: string;
    headline: string;
    bio: string;
    cv: string;
    coverLetter: string;
    canApply: boolean;
    percentageCompleted: number;
    experiance: Experience[]; // Note: keeping the typo from the API
    educationalHistory: EducationalHistory[];
    skills: Skill[];
    profile: Profile;
    __user__?: User;
}

// API response types
export interface ApplicantDetailsResponse {
    data: ApplicantDetails;
    success: boolean;
    message?: string;
}

// Mutation payload types
export interface ShortlistPayload {
    applicants: string[];
}

export interface ShortlistResponse {
    success: boolean;
    message: string;
}

// Utility types for component props
export type ApplicantProfileProps = {
    applicantId: string;
};

// Form types for editing (if needed)
export type UpdateApplicantPayload = Partial<
    Pick<ApplicantDetails, 'headline' | 'bio' | 'isActive'>
>;

export type UpdateProfilePayload = Partial<
    Pick<
        Profile,
        | 'firstName'
        | 'middleName'
        | 'lastName'
        | 'title'
        | 'phoneNumber'
        | 'marriageStatus'
    >
>;

// Enum types for better type safety
export enum WorkType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    CONTRACT = 'CONTRACT',
    INTERNSHIP = 'INTERNSHIP',
    FREELANCE = 'FREELANCE',
}

export enum WorkPlace {
    REMOTE = 'REMOTE',
    ON_SITE = 'ON_SITE',
    HYBRID = 'HYBRID',
}

export enum EducationLevel {
    BSC = 'BSC',
    MSC = 'MSC',
    PHD = 'PHD',
    DIPLOMA = 'DIPLOMA',
    CERTIFICATE = 'CERTIFICATE',
    HIGH_SCHOOL = 'HIGH_SCHOOL',
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

// Helper types for formatting
export type FormattedExperience = Experience & {
    formattedType: string;
    formattedWorkPlace: string;
    formattedDuration: string;
    isCurrentJob: boolean;
};

export type FormattedEducation = EducationalHistory & {
    formattedLevel: string;
    formattedDuration: string;
    formattedGrade: string;
};

// API hook return types (for react-query)
export type UseApplicantDetailsReturn = {
    data: ApplicantDetails | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
};

export type UseShortlistMutationReturn = {
    mutate: (payload: ShortlistPayload) => void;
    isPending: boolean;
    error: Error | null;
    isSuccess: boolean;
};

export type UseRejectMutationReturn = {
    mutate: () => void;
    isPending: boolean;
    error: Error | null;
    isSuccess: boolean;
};

export type UseProfilePictureReturn = {
    data: Blob | undefined;
    isLoading: boolean;
    error: Error | null;
};

const applicantDetails = async (id: string) => {
    const profile: ApplicantDetails = await fetcher(
        `/job-portal/applicant/${id}`,
        {
            method: 'GET',
            headers: { accept: '*/*' },
        },
    );

    return profile;
};
export { applicantDetails };

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

const shortListedApplicants = async (
    programId: string,
    applicants: string[],
) => {
    const response = await fetcher(`/job-portal/shortList/${programId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list: applicants }),
    });

    return response;
};
const shortRejectedLists = async (programId: string) => {
    const response = await fetcher(
        `/job-portal/rejectNotShortList/${programId}`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        },
    );

    return response;
};

const useShortLIstMutation = (programId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['shortListedApplicants', programId],
        mutationFn: async ({ applicants }: { applicants: string[] }) =>
            await shortListedApplicants(programId, applicants),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['applicants'],
            });
            queryClient.invalidateQueries({
                queryKey: ['applicants', programId, 'SHORTLISTED'],
            });
            notifications.show({
                title: 'Success',
                message: 'Applicants shortlisted successfully.',
                color: 'green',
            });
            return data;
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message: `Failed to shortlist applicants: ${error.message}`,
                color: 'red',
            });
            throw error;
        },
    });
};

const useShortRejectedMutation = (programId: string) => {
    return useMutation({
        mutationKey: ['shortRejectedLists', programId],
        mutationFn: async () => await shortRejectedLists(programId),
        onSuccess: (data) => {
            notifications.show({
                title: 'Success',
                message: 'Applicants rejected successfully.',
                color: 'green',
            });
            return data;
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message: `Failed to reject applicants: ${error.message}`,
                color: 'red',
            });
            throw error;
        },
    });
};
export { useShortLIstMutation, useShortRejectedMutation };

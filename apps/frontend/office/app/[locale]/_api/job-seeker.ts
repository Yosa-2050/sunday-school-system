import { notifications } from '@mantine/notifications';
import { COOKIE_ACCESS_TOKEN, fetcher } from '@shega/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface Role {
    id: string;
    role: string;
    isDefault: boolean;
    createdAt: string;
    isActive: boolean;
}

interface UserData {
    id: string;
    email: string;
    userName?: string;
    pwd_change_required: boolean;
    email_confirmed: boolean;
    note?: string;
    roles: Role[];
}

interface ApplicantProfile {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    mothersFullName?: string;
    birthDate?: string;
    dobGregorian?: string;
    gender?: string;
    marriageStatus?: string;
    title?: string;
    phoneNumber?: string;
    profile_picture_id?: string;
    createdAt: string;
    isActive: boolean;
    __user__?: UserData;
    __has_user__: boolean;
}

const applicantDetails = async (id: string) => {
    const profile: ApplicantProfile = await fetcher(`/profile/${id}`, {
        method: 'GET',
        headers: { accept: '*/*' },
    });

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
    return useMutation({
        mutationKey: ['shortListedApplicants', programId],
        mutationFn: async ({ applicants }: { applicants: string[] }) =>
            await shortListedApplicants(programId, applicants),
        onSuccess: (data) => {
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

import { COOKIE_ACCESS_TOKEN, fetcher } from '@shega/shared';
import { useQuery } from '@tanstack/react-query';
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

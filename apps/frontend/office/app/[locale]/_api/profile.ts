import { COOKIE_ACCESS_TOKEN } from '@shega/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

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

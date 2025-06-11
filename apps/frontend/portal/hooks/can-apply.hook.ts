import { fetcher } from '@shega/shared';
import { useQuery } from '@tanstack/react-query';

export type CanApplyResponse = {
    cv: true;
    coverLetter: false;
    profilePic: false;
    profile: false;
    education: true;
    experiance: true;
    canApply: false;
};

export const useCanApply = () => {
    const {
        data: canApply,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['can-apply'],
        queryFn: async () => {
            const response = await fetcher('/job-seeker/canApply', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            return response as CanApplyResponse;
        },
    });

    return { canApply, isLoading, refetch };
};

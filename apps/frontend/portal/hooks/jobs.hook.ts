import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    type Filter,
    fetchJobs,
    likeJob,
    unlikeJob,
} from 'app/_api/jobs/fetch-jobs';

const getJobQueryKey = (filters?: Filter) => [
    'job-seeker-jbs',
    filters?.pagination?.page ?? 1,
    filters?.pagination?.limit ?? 5,
];

export const useJobs = ({
    filters,
    isJob,
}: { filters?: Filter; isJob?: boolean }) => {
    const queryClient = useQueryClient();

    const { data, isLoading, isFetching, error, refetch } = useQuery({
        queryKey: getJobQueryKey(filters),
        queryFn: () => fetchJobs(filters as Filter),
        enabled: !!filters,
        staleTime: 0,
    });

    const likeMutation = useMutation({
        mutationFn: likeJob,
        onSuccess: async () => {
            await refetch();

            notifications.show({
                title: 'Job Saved',
                message: isJob
                    ? 'Job saved successfully'
                    : 'Mentorship Program saved successfully',
                color: 'green',
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message:
                    error instanceof Error
                        ? error.message
                        : 'An error occurred while liking the job.',
                color: 'red',
            });
        },
        retry: false,
    });

    const unlikeMutation = useMutation({
        mutationFn: unlikeJob,
        onSuccess: async () => {
            await refetch();

            notifications.show({
                title: 'Job Unsaved',
                message: isJob
                    ? 'Job unsaved successfully'
                    : 'Mentorship Program unsaved successfully',
                color: 'green',
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message:
                    error instanceof Error
                        ? error.message
                        : 'An error occurred while unliking the job.',
                color: 'red',
            });
        },
        retry: false,
    });

    return {
        data,
        isLoading,
        isFetching,
        error,
        likeMutation,
        unlikeMutation,
        refetch,
    };
};

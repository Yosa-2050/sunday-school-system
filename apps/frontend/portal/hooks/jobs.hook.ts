import { notifications } from '@mantine/notifications';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    type Filter,
    fetchJobs,
    likeJob,
    unlikeJob,
} from 'app/_api/jobs/fetch-jobs';

export const useJobs = ({
    filters,
    isJob,
}: { filters?: Filter; isJob?: boolean }) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [
            'job-seeker-jbs',
            filters?.pagination?.page,
            filters?.pagination.limit,
        ],
        queryFn: () => fetchJobs(filters as Filter),
        enabled: !!filters,
    });

    const likeMutation = useMutation({
        mutationFn: likeJob,
        mutationKey: ['like-job'],
        onSuccess: () => {
            refetch();
            notifications.show({
                title: 'Job Liked',
                message: isJob
                    ? 'Job saved successfully'
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
        mutationKey: ['unlike-job'],
        onSuccess: () => {
            refetch();
            notifications.show({
                title: 'Job Unliked',
                message: isJob
                    ? 'Job unsaved successfully'
                    : 'Mentorship Program unsaved successfully',
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

    return { data, isLoading, error, likeMutation, unlikeMutation, refetch };
};

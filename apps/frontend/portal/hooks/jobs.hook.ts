import { notifications } from "@mantine/notifications";
import { entityParamSerializer } from "@shega/shared";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchJobs, likeJob, unlikeJob } from "app/_api/jobs/fetch-jobs";

export const useJobs = (entityParams: any) => {
    
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['job-seeker-jbs', entityParamSerializer(entityParams)],
        queryFn: () =>
            fetchJobs({
                pagination: {
                    page: 1,
                    limit: 5,
                },
            }),
    });

    const likeMutation = useMutation({
        mutationFn: likeJob,
        mutationKey: ['like-job'],
        onSuccess: () => {
            refetch();
            notifications.show({
                title: 'Job Liked',
                message: 'You have successfully liked the job.',
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
                message: 'You have successfully unliked the job.',
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

    return { data, isLoading, error, likeMutation, unlikeMutation };
}
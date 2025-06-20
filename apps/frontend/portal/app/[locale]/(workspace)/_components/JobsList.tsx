import { Button, LoadingOverlay, Text } from '@mantine/core';
import { useRouter } from 'next-nprogress-bar';

import { useJobs } from '@/hooks/jobs.hook';
import { JobCard } from './JobCard';

// Components
export function JobList() {
    const router = useRouter();

    const { data, isLoading, error, likeMutation, unlikeMutation } = useJobs({
        filters: {
            pagination: {
                page: 1,
                limit: 5,
            },
        },
    });

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }
    if (error) {
        return <Text color="red">Error loading jobs</Text>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {data?.data.slice(0, 4).map((job) => (
                <JobCard job={job} key={job.id} />
            ))}

            <div className="col-span-full flex justify-center mt-4">
                <Button
                    variant="light"
                    onClick={() => router.push('/jobs')}
                    className="transition-colors"
                >
                    View More Jobs
                </Button>
            </div>
        </div>
    );
}

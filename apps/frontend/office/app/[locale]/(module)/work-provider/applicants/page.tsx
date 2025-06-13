'use client';

import { EntityPageLoading } from '@/components/EntityPageLoading';
import { Box, Divider, Paper, Select, Tabs, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { entityParamSerializer } from '@shega/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
    type JobsResponse,
    fetchJobs,
} from 'app/[locale]/_api/organizations/fetch-jobs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Applicants } from './_components/Aplicants';

const Page = () => {
    const params = useSearchParams();
    const jobId = params.get('jobId');
    const [selectedJob, setSelectedJob] = useState<string | null>(jobId);
    const [search, setSearch] = useState('');
    const [debouncedValue] = useDebouncedValue(search, 300);

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<JobsResponse, Error>({
        queryKey: ['jobs'],
        queryFn: ({ pageParam = 1 }) =>
            fetchJobs(entityParamSerializer({ p: pageParam as number, pp: 1 })),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const next = lastPage.page + 1;
            return next <= lastPage.totalPages ? next : undefined;
        },
    });

    const jobs = data?.pages.flatMap((page) => page.data) || [];

    const jobOptions = jobs.map((job) => ({
        value: job.id, // make sure `job.id` exists; adjust if needed
        label: job.title,
    }));

    useEffect(() => {
        if (jobs.length > 0 && !selectedJob) {
            setSelectedJob(jobs?.[0]?.id ?? null);
        }
    }, [jobs, selectedJob]);

    if (isLoading) {
        return <EntityPageLoading />;
    }
    if (isError) {
        return <div>Error loading jobs.</div>;
    }

    return (
        <Box className="w-full flex flex-col items-center  gap-2.5">
            <Paper className="p-4 w-full">
                <h1 className="text-xl font-bold mb-4">Select a Job</h1>
                <Select
                    className="max-w-md"
                    label="Jobs"
                    placeholder="Select job"
                    searchable
                    data={jobOptions}
                    value={selectedJob}
                    allowDeselect={false}
                    onChange={setSelectedJob}
                    onScroll={(event) => {
                        const target = event.currentTarget;
                        const scrollPosition =
                            target.scrollTop + target.clientHeight >=
                            target.scrollHeight - 10;
                        if (
                            scrollPosition &&
                            hasNextPage &&
                            !isFetchingNextPage
                        ) {
                            fetchNextPage();
                        }
                    }}
                    withAsterisk
                />
                <Divider my="sm" />
                <TextInput
                    placeholder="Search Applicants"
                    className="max-w-md"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Paper>
            <Paper p={'md'} className="w-full">
                <Tabs defaultValue={'applicants'}>
                    <Tabs.List>
                        <Tabs.Tab value="applicants">Applicants</Tabs.Tab>
                        <Tabs.Tab value="shortlisted">Shortlisted</Tabs.Tab>
                        <Tabs.Tab value="rejected">Rejected</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="applicants" pt="md">
                        {selectedJob ? (
                            <Applicants
                                jobId={selectedJob}
                                search={debouncedValue}
                            />
                        ) : (
                            <>Selected</>
                        )}
                    </Tabs.Panel>
                    <Tabs.Panel value="shortlisted" pt="md">
                        Shortlisted
                    </Tabs.Panel>
                    <Tabs.Panel value="rejected" pt="md">
                        Rejected
                    </Tabs.Panel>
                </Tabs>
            </Paper>
        </Box>
    );
};

export default Page;

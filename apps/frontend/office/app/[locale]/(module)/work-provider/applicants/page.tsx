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
import { RejectedList } from './_components/Rejected';
import { ShortListed } from './_components/Shortlist';

const Page = () => {
    const params = useSearchParams();
    const jobIdParam = params.get('jobId');
    const [selectedJob, setSelectedJob] = useState<string | null>(jobIdParam);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebouncedValue(search, 300);

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery<JobsResponse, Error>({
            queryKey: ['jobs'],
            queryFn: ({ pageParam = 1 }) =>
                fetchJobs(
                    entityParamSerializer({
                        p: pageParam as number,
                        pp: 10,
                        f: [{ f: 'program.status', v: 'APPROVED', o: 'eq' }],
                    }),
                ),
            initialPageParam: 1,
            getNextPageParam: (lastPage) => {
                const next = lastPage.page + 1;
                return next <= lastPage.totalPages ? next : undefined;
            },
        });

    const jobs = data?.pages.flatMap((page) => page.data) || [];

    const jobOptions = jobs.map((job) => ({
        value: job.programId,
        label: job.title,
    }));

    useEffect(() => {
        if (jobs.length > 0 && !selectedJob) {
            setSelectedJob(jobs[0] ? jobs[0].programId : '');
        }
    }, [jobs, selectedJob]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        if (
            scrollTop + clientHeight >= scrollHeight - 10 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
    };

    if (isLoading) {
        return <EntityPageLoading />;
    }

    return (
        <Box className="w-full flex flex-col items-center gap-2.5">
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
                    onScroll={handleScroll}
                    withAsterisk
                />
                <Divider my="sm" />
                <TextInput
                    placeholder="Search Applicants"
                    className="max-w-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Paper>

            <Paper p="md" className="w-full">
                <Tabs defaultValue="applicants">
                    <Tabs.List>
                        <Tabs.Tab value="applicants">Applicants</Tabs.Tab>
                        <Tabs.Tab value="shortlisted">Shortlisted</Tabs.Tab>
                        <Tabs.Tab value="rejected">Rejected</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="applicants" pt="md">
                        <Applicants
                            jobId={selectedJob ?? ''}
                            search={debouncedSearch}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="shortlisted" pt="md">
                        <ShortListed
                            jobId={selectedJob ?? ''}
                            search={debouncedSearch}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="rejected" pt="md">
                        <RejectedList
                            jobId={selectedJob ?? ''}
                            search={debouncedSearch}
                        />
                    </Tabs.Panel>
                </Tabs>
            </Paper>
        </Box>
    );
};

export default Page;

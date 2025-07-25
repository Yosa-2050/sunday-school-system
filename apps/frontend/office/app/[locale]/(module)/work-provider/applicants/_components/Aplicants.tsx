'use client';

import { Button, Flex, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useShortLIstMutation } from 'app/[locale]/_api/job-seeker';
import { fetchApplicants } from 'app/[locale]/_api/organizations/fetch-jobs';
import { useState } from 'react';
import { ApplicantsFilters } from './ApplicantFilters';
import { ApplicantsTable } from './ApplicantsTable';
import { RejectUnshortlistedSection } from './RejectApplicants';

export interface Filters {
    status: string;
    experience: {
        min: number | '';
        max: number | '';
    };
    category: string[];
    gender: string | null;
    ageTo: number | '';
    ageFrom: number | '';
    skills: string[];
    educationalRequirment: string[];
}

const cleanFilters = (filters: Filters) => {
    return Object.fromEntries(
        Object.entries(filters).filter(([_, value]) =>
            Array.isArray(value) ? value.length > 0 : value !== '',
        ),
    );
};

export const Applicants = ({
    jobId,
    search,
}: {
    jobId: string;
    search: string;
}) => {
    const [filters, setFilters] = useState<Filters>({
        status: '',
        experience: { min: '', max: '' },
        category: [],
        skills: [],
        educationalRequirment: [],
        gender: null,
        ageTo: '',
        ageFrom: '',
    });

    const [page, setPage] = useState(1);
    const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const { mutate: shortlistMutation, isPending: isShortlisting } =
        useShortLIstMutation(jobId);

    const {
        data: applicants,
        isLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ['applicants', jobId, search, 'PENDING', page],
        queryFn: () =>
            fetchApplicants(
                {
                    ...cleanFilters(filters),
                    status: filters.status,
                    pagination: {
                        page,
                        limit: 10,
                        search,
                    },
                },
                jobId,
                'PENDING',
            ),
    });

    const handleShortlist = async () => {
        if (selectedApplicants.length > 0) {
            await shortlistMutation({ applicants: selectedApplicants });
            setSelectedApplicants([]);
        }
    };

    return (
        <Stack gap="md">
            {(applicants?.data?.length ?? 0) > 0 && (
                <RejectUnshortlistedSection jobId={jobId} />
            )}

            <ApplicantsFilters
                filters={filters}
                setFilters={setFilters}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                refetch={refetch}
            />

            <ApplicantsTable
                applicants={applicants}
                isLoading={isLoading}
                isFetching={isFetching}
                selectedApplicants={selectedApplicants}
                setSelectedApplicants={setSelectedApplicants}
                onShortlist={handleShortlist}
                isShortlisting={isShortlisting}
                page={page}
                setPage={setPage}
            />
            {selectedApplicants.length > 0 && (
                <Flex justify="flex-end" gap={'xs'}>
                    <Button
                        onClick={() => setSelectedApplicants([])}
                        bg={'red.4'}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleShortlist}>Shortlist</Button>
                </Flex>
            )}
        </Stack>
    );
};

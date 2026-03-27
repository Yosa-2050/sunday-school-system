'use client';

import { EntityPagination } from '@/components/EntityPagination';
import { Footer } from '@/components/Footer';
import { useJobs } from '@/hooks/jobs.hook';
import {
    Box,
    Container,
    Grid,
    Loader,
    LoadingOverlay,
    Stack,
    Text,
} from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { PER_PAGE, entityParamSchema } from '@shega/shared';
import type { Filter } from 'app/_api/jobs/fetch-jobs';
import { useSearchParams } from 'next/navigation';
import { parseAsJson, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { JobCard } from '../_components/JobCard';
import { FilterSidebar } from './components/FilterSidebar';
import JobHeader from './components/JobHeader';
import NoData from './components/NoData';

const initialValues = (title?: string | null): Filter => {
    return {
        pagination: {
            page: 1,
            limit: PER_PAGE,
        },
        title: title || '',
        categoryId: '',
        organizationId: '',
        cityId: '',
        type: '',
        experianceLevel: '',
        salaryFrom: 0,
    };
};

export default function JobsPage() {
    const searchParam = useSearchParams();

    const [filters, setFilters] = useState<Filter>(
        initialValues(searchParam.get('search')) || initialValues(''),
    );
    const updateFilters = ({
        key,
        value,
    }: { key: keyof Filter; value: string }) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const { data, isLoading, isFetching, refetch } = useJobs({
        filters,
    });
    const isEmpty = !!data?.data?.length;
    const [entityParams, setEntityParams] = useQueryState(
        'job-seeker-jbs',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: PER_PAGE,
        }),
    );

    const [shouldApplyFilters, setShouldApplyFilters] = useState(false);

    const handleSearch = useDebouncedCallback((term: string | null) => {
        if (term) {
            setEntityParams({ ...entityParams, p: 1, s: term });
            setFilters((prev) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    search: term,
                    page: 1,
                },
            }));
            setShouldApplyFilters(true);
        } else {
            const updatedParams = { ...entityParams };
            updatedParams.s = undefined;
            setEntityParams({ ...updatedParams, p: 1 });
            setFilters((prev) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    search: undefined,
                    page: 1,
                },
            }));
            setShouldApplyFilters(true);
        }
    }, 300);

    useEffect(() => {
        if (shouldApplyFilters && searchParam.get('search')) {
            handleApplyFilters();
            setShouldApplyFilters(false);
        }
    }, [shouldApplyFilters]);

    const handleApplyFilters = () => {
        refetch();
    };

    const resetFilters = () => {
        setFilters(initialValues(searchParam.get('title')));
    };

    const createPageURL = (page: number) => {
        setFilters((prev) => ({
            ...prev,
            pagination: {
                ...prev.pagination,
                page,
            },
        }));
        setShouldApplyFilters(true);
    };

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }
    return (
        <>
            <Container size="xl" py="xl">
                <Grid>
                    <Grid.Col span={{ base: 12, md: 3 }} visibleFrom="md">
                        <FilterSidebar
                            filters={filters}
                            setFilters={setFilters}
                            handleJobTypeChange={(value) =>
                                updateFilters({ key: 'type', value })
                            }
                            handleExperienceLevelChange={(value) =>
                                updateFilters({ key: 'experianceLevel', value })
                            }
                            handleSearch={handleSearch}
                            handleApplyFilters={handleApplyFilters}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 9 }}>
                        <Stack gap="md">
                            <JobHeader
                                total={data?.total ?? 0}
                                filters={filters}
                                setFilters={setFilters}
                                handleJobTypeChange={(value) =>
                                    updateFilters({ key: 'type', value: value })
                                }
                                handleExperienceLevelChange={(value) =>
                                    updateFilters({
                                        value,
                                        key: 'experianceLevel',
                                    })
                                }
                                handleSearch={handleSearch}
                                handleApplyFilters={handleApplyFilters}
                            />
                            {isFetching ? (
                                <Box
                                    style={{ width: '100%', height: 300 }}
                                    className="flex flex-col items-center justify-center"
                                >
                                    <Loader size={'md'} />
                                    <Text>Loading jobs...</Text>
                                </Box>
                            ) : isEmpty ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data?.data.map((job) => (
                                        <JobCard
                                            key={job.id}
                                            job={job}
                                            refetch={refetch}
                                        />
                                    ))}
                                    <EntityPagination
                                        p={filters.pagination.page ?? 1}
                                        total={data?.total ?? 0}
                                        perPage={PER_PAGE}
                                        createPageURL={createPageURL}
                                    />
                                </div>
                            ) : (
                                <NoData resetFilters={resetFilters} />
                            )}
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

'use client';

import { Footer } from '@/components/Footer';
import {
    Container, Grid,
    LoadingOverlay, Stack
} from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { PER_PAGE, entityParamSchema } from '@shega/shared';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from 'app/_api/jobs/fetch-jobs';
import type { Filter } from 'app/_api/jobs/fetch-jobs';
import { useSearchParams } from 'next/navigation';
import { parseAsJson, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { FilterSidebar } from './components/FilterSidebar';
import { JobCard } from './components/JobCard';
import { EntityPagination } from '@/components/EntityPagination';
import JobHeader from './components/JobHeader';
import NoData from './components/NoData';


const initialValues = (title? : string | null):Filter =>  {
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
        }
}

export default function JobsPage() {
    
    const searchParam = useSearchParams();

    const [filters, setFilters] = useState<Filter>(initialValues(searchParam.get('title')));
    const updateFilters = ({key, value}: {key: keyof Filter, value: string}) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['job-seeker-jbs',filters.pagination.page],
        queryFn: () => fetchJobs(filters),
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

 
    // biome-ignore lint/correctness/useExhaustiveDependencies(searchParam.get): intentional
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
                    <Grid.Col
                        span={{ base: 12, md: 3 }}
                        visibleFrom="md"
                    >
                        <FilterSidebar
                            filters={filters}
                            setFilters={setFilters}
                            handleJobTypeChange={(value) => updateFilters({key: 'type', value})}
                            handleExperienceLevelChange={(value) => updateFilters({key: 'experianceLevel', value})}
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
                                    handleJobTypeChange={(value)=> updateFilters({key: 'type', value: value})}
                                    handleExperienceLevelChange={(value) => updateFilters({value, key: 'experianceLevel'})}
                                    handleSearch={handleSearch}
                                    handleApplyFilters={handleApplyFilters}
                               />

                            <div className="grid grid-cols-2 gap-4">
                                {isEmpty ? (
                                    data?.data.map((job) => (
                                        <JobCard key={job.id} job={job} />
                                    ))
                                ) : (
                                    <NoData resetFilters={resetFilters}/>
                                )}
                            </div>
                            <EntityPagination
                                p={filters.pagination.page ?? 1}
                                total={data?.total ?? 0}
                                perPage={PER_PAGE}
                                createPageURL={createPageURL}
                            />
                         </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

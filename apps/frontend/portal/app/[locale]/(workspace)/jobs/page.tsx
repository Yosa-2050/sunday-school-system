'use client';

import { Footer } from '@/components/Footer';
import { useRouter } from '@/i18n/routing';
import {
    Box,
    Button,
    Card,
    Container,
    Divider,
    Drawer,
    Grid,
    LoadingOverlay,
    Pagination,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { PER_PAGE, entityParamSchema } from '@shega/shared';
import { useAuth } from '@shega/ui';
import { IconBriefcase, IconFilter, IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from 'app/_api/jobs/fetch-jobs';
import type { Filter } from 'app/_api/jobs/fetch-jobs';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { parseAsJson, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { cn } from 'utility/cn';
import { FilterSidebar } from './components/FilterSidebar';
import { JobCard } from './components/JobCard';

export default function JobsPage() {
    const { user } = useAuth();
    const t = useTranslations('jobListing');
    const router = useRouter();
    const searchParam = useSearchParams();
    const [opened, setOpened] = useState(false);
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['job-seeker-jbs'],
        queryFn: () => fetchJobs(filters),
    });

    const [entityParams, setEntityParams] = useQueryState(
        'job-seeker-jbs',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: PER_PAGE,
        }),
    );

    const [filters, setFilters] = useState<Filter>({
        pagination: {
            page: 1,
            limit: PER_PAGE,
        },
        title: '',
        categoryId: '',
        organizationId: '',
        cityId: '',
        type: '',
        experianceLevel: '',
        salaryFrom: undefined,
        salaryTo: undefined,
    });

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
        if (!user) {
            router.push('/auth/login');
        }
    }, [user, router]);

    // biome-ignore lint/correctness/useExhaustiveDependencies(searchParam): intentional
    // biome-ignore lint/correctness/useExhaustiveDependencies(searchParam.get): intentional
    useEffect(() => {
        const initialFilters = {
            pagination: {
                page: 1,
                limit: PER_PAGE,
            },
            title: searchParam.get('search') || '',
            categoryId: '',
            organizationId: '',
            cityId: '',
            type: '',
            experianceLevel: '',
        };

        setFilters(initialFilters);
        setShouldApplyFilters(true);
    }, []);

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

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (error) {
        return <Text color="red">Error loading jobs</Text>;
    }

    const handleJobTypeChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            type: value,
        }));
    };

    const handleExperienceLevelChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            experianceLevel: value,
        }));
    };

    const resetFilters = () => {
        setFilters({
            pagination: {
                page: 1,
                limit: PER_PAGE,
            },
            title: '',
            categoryId: '',
            organizationId: '',
            cityId: '',
            type: '',
            experianceLevel: '',
        });
    };

    const perPage = PER_PAGE;
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / perPage);
    const currentPage = filters.pagination.page;
    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);
    const hideCounter = false;

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

    return (
        <>
            <Container size="xl" py="xl">
                <Grid>
                    <Grid.Col
                        span={{ base: 12, md: 3 }}
                        visibleFrom="md"
                        // className="sticky top-0"
                    >
                        <FilterSidebar
                            filters={filters}
                            setFilters={setFilters}
                            handleJobTypeChange={handleJobTypeChange}
                            handleExperienceLevelChange={
                                handleExperienceLevelChange
                            }
                            handleSearch={handleSearch}
                            handleApplyFilters={handleApplyFilters}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 9 }}>
                        <Stack gap="md">
                            <Card
                                className="flex items-center justify-between w-full p-4"
                                withBorder={false}
                            >
                                <div className="flex items-center justify-between gap-3 w-full">
                                    <div className="bg-primary/10 p-2.5 rounded-lg flex items-center justify-center gap-1">
                                        <IconBriefcase
                                            size={25}
                                            className="text-primary"
                                        />
                                        <Title order={2} className=" text-xl">
                                            {t('jobListings')}
                                        </Title>
                                    </div>
                                    <div>
                                        <Text
                                            size="xs"
                                            c={'dimmed'}
                                            className="mt-0.5"
                                        >
                                            {data?.total ?? 0} {t('jobsFound')}
                                        </Text>
                                    </div>
                                </div>
                                <Box className="md:hidden">
                                    <Drawer
                                        opened={opened}
                                        onClose={() => setOpened(false)}
                                        title={t('filterJobs')}
                                        position="left"
                                        size="sm"
                                        padding="md"
                                    >
                                        <Grid.Col
                                            span={{ base: 12, md: 3 }}
                                            hiddenFrom="md"
                                        >
                                            <FilterSidebar
                                                filters={filters}
                                                setFilters={setFilters}
                                                handleJobTypeChange={
                                                    handleJobTypeChange
                                                }
                                                handleExperienceLevelChange={
                                                    handleExperienceLevelChange
                                                }
                                                handleSearch={handleSearch}
                                                handleApplyFilters={
                                                    handleApplyFilters
                                                }
                                            />
                                        </Grid.Col>
                                    </Drawer>
                                    <IconFilter
                                        size={20}
                                        className="text-primary"
                                        onClick={() => setOpened(true)}
                                    />
                                </Box>
                            </Card>

                            <div className="grid grid-cols-1 gap-4">
                                {data?.data && data.data.length > 0 ? (
                                    data.data.map((job) => (
                                        <JobCard key={job.id} job={job} />
                                    ))
                                ) : (
                                    <Card shadow="sm">
                                        <div className=" p-8 rounded-full mb-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
                                            <div className="relative">
                                                <IconBriefcase
                                                    size={56}
                                                    className="text-primary animate-bounce-slow"
                                                />
                                                <div className="absolute -top-2 -right-2 bg-primary/10 rounded-full p-2">
                                                    <IconSearch
                                                        size={16}
                                                        className="text-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Text
                                            size="2xl"
                                            fw={700}
                                            mb={'lg'}
                                            className="text-gray-800 mb-3 text-center mb-4"
                                        >
                                            {t('noJobsFound')}
                                        </Text>
                                        <Divider my={'md'} />
                                        <div className="flex gap-4">
                                            <Button
                                                variant="filled"
                                                color="primary"
                                                radius="xl"
                                                size="md"
                                                leftSection={
                                                    <IconFilter size={16} />
                                                }
                                                onClick={resetFilters}
                                                className="hover:scale-105 transition-transform duration-200"
                                            >
                                                {t('resetFilters')}
                                            </Button>
                                            <Button
                                                variant="light"
                                                color="primary"
                                                radius="xl"
                                                size="md"
                                                leftSection={
                                                    <IconSearch size={16} />
                                                }
                                                onClick={() => {
                                                    // Focus on search input
                                                    const searchInput =
                                                        document.querySelector(
                                                            'input[type="text"]',
                                                        );
                                                    if (searchInput) {
                                                        (
                                                            searchInput as HTMLElement
                                                        ).focus();
                                                    }
                                                }}
                                                className="hover:scale-105 transition-transform duration-200"
                                            >
                                                {t('searchAgain')}
                                            </Button>
                                        </div>
                                    </Card>
                                )}
                            </div>

                            <Box
                                className={cn(
                                    'flex items-center mt-6',
                                    hideCounter
                                        ? 'justify-center'
                                        : 'justify-between',
                                )}
                            >
                                <Box className="px-2">
                                    {from} to {to} of {total} results
                                </Box>
                                {total >= perPage ? (
                                    <Pagination
                                        size="sm"
                                        total={totalPages}
                                        value={currentPage}
                                        onChange={createPageURL}
                                    />
                                ) : null}
                            </Box>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

'use client';

import { Footer } from '@/components/Footer';
import { useRouter } from '@/i18n/routing';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Checkbox,
    Chip,
    Container,
    Drawer,
    Grid,
    Group,
    LoadingOverlay,
    Paper,
    RangeSlider,
    ScrollArea,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
    TypographyStylesProvider,
} from '@mantine/core';
import { useDebouncedCallback, useMediaQuery } from '@mantine/hooks';
import {
    PER_PAGE,
    entityParamSchema,
    entityParamSerializer,
} from '@shega/shared';
import { EntityPagination, useAuth } from '@shega/ui';
import {
    IconBookmark,
    IconBriefcase,
    IconClock,
    IconCurrencyDollar,
    IconFilter,
    IconMapPin,
    IconSearch,
    IconStar,
    IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from 'app/_api/jobs/fetch-jobs';
import type { Filter } from 'app/_api/jobs/fetch-jobs';
import parse from 'html-react-parser';
import { useLocale, useTranslations } from 'next-intl';
import { parseAsJson, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

// Types
interface JobFilters {
    location: string;
    jobType: string[];
    salaryRange: [number, number];
    experienceLevel: string[];
    keyword: string;
}

interface JobType {
    value: string;
    label: string;
}

interface ExperienceLevel {
    value: string;
    label: string;
}

const JOB_TYPES: JobType[] = [
    { value: 'FULL_TIME', label: 'Full-time' },
    { value: 'PART_TIME', label: 'Part-time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERNSHIP', label: 'Internship' },
];

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
    { value: 'ENTRY', label: 'Entry Level' },
    { value: 'MID', label: 'Mid Level' },
    { value: 'SENIOR', label: 'Senior Level' },
];

const LOCATIONS = [
    'Addis Ababa',
    'Remote',
    'Dire Dawa',
    'Hawassa',
    'Gondar',
    'Mekelle',
    'Adama',
    'Jimma',
    'Bahir Dar',
    'Other',
];

const calculateActiveFilters = (filters: Filter) => {
    const baseFilters = Object.entries(filters).filter(([key, value]) => {
        if (
            key === 'salaryFrom' ||
            key === 'salaryTo' ||
            key === 'pagination'
        ) {
            return false;
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value !== '' && value !== undefined;
    }).length;

    const hasSalaryFilter =
        (filters.salaryFrom || 0) !== 0 || (filters.salaryTo || 0) !== 100000;
    return baseFilters + (hasSalaryFilter ? 1 : 0);
};

const FilterChips = ({
    filters,
    setFilters,
}: {
    filters: Filter;
    setFilters: (filters: Filter) => void;
}) => {
    const salaryFrom = filters.salaryFrom ?? 0;
    const salaryTo = filters.salaryTo ?? 0;
    const hasSalaryFilter = salaryFrom > 0 || salaryTo < 100000;

    return (
        <Group gap="xs" wrap="wrap">
            {filters.title && (
                <Chip
                    checked
                    variant="light"
                    radius="xl"
                    onClick={() =>
                        setFilters({
                            ...filters,
                            title: '',
                        })
                    }
                >
                    Keyword: {filters.title}
                </Chip>
            )}
            {filters.cityId && (
                <Chip
                    checked
                    variant="light"
                    radius="xl"
                    onClick={() =>
                        setFilters({
                            ...filters,
                            cityId: '',
                        })
                    }
                >
                    Location: {filters.cityId}
                </Chip>
            )}
            {filters.type && (
                <Chip
                    checked
                    variant="light"
                    radius="xl"
                    onClick={() =>
                        setFilters({
                            ...filters,
                            type: '',
                        })
                    }
                >
                    Job Type: {filters.type}
                </Chip>
            )}
            {filters.experianceLevel && (
                <Chip
                    checked
                    variant="light"
                    radius="xl"
                    onClick={() =>
                        setFilters({
                            ...filters,
                            experianceLevel: '',
                        })
                    }
                >
                    Experience: {filters.experianceLevel}
                </Chip>
            )}
            {hasSalaryFilter && (
                <Chip
                    checked
                    variant="light"
                    radius="xl"
                    onClick={() =>
                        setFilters({
                            ...filters,
                            salaryFrom: 0,
                            salaryTo: 100000,
                        })
                    }
                >
                    Salary: {salaryFrom.toLocaleString()} -{' '}
                    {salaryTo.toLocaleString()} ETB
                </Chip>
            )}
        </Group>
    );
};

interface FilterSidebarProps {
    filters: Filter;
    setFilters: (filters: Filter) => void;
    handleJobTypeChange: (value: string) => void;
    handleExperienceLevelChange: (value: string) => void;
    handleSearch: (term: string | null) => void;
    handleApplyFilters: () => void;
}

const FilterSidebar = ({
    filters,
    setFilters,
    handleJobTypeChange,
    handleExperienceLevelChange,
    handleSearch,
    handleApplyFilters,
}: FilterSidebarProps) => {
    const t = useTranslations('jobListing');
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <Paper p="md" radius="lg" shadow="sm" className="sticky top-4">
            <ScrollArea h={isMobile ? 400 : 700}>
                <Stack gap="md">
                    <Box>
                        <Text size="sm" fw={500} mb="xs">
                            {t('keyword')}
                        </Text>
                        <TextInput
                            value={filters.title ?? ''}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    title: e.target.value,
                                })
                            }
                            placeholder="Search jobs..."
                            leftSection={<IconSearch size={16} />}
                            radius="md"
                        />
                    </Box>

                    <Box>
                        <Text size="sm" fw={500} mb="xs">
                            {t('location')}
                        </Text>
                        <Select
                            value={filters.cityId ?? ''}
                            onChange={(value) =>
                                setFilters({
                                    ...filters,
                                    cityId: value || '',
                                })
                            }
                            placeholder="Select location"
                            data={LOCATIONS}
                            leftSection={<IconMapPin size={16} />}
                            radius="md"
                            searchable
                            clearable
                        />
                    </Box>

                    <Box>
                        <Text size="sm" fw={500} mb="xs">
                            {t('jobType')}
                        </Text>
                        <Stack gap="xs">
                            {JOB_TYPES.map((type) => (
                                <Checkbox
                                    key={type.value}
                                    label={type.label}
                                    checked={filters.type === type.value}
                                    onChange={() =>
                                        handleJobTypeChange(type.value)
                                    }
                                    radius="md"
                                />
                            ))}
                        </Stack>
                    </Box>

                    <Box>
                        <Text size="sm" fw={500} mb="xs">
                            {t('experienceLevel')}
                        </Text>
                        <Stack gap="xs">
                            {EXPERIENCE_LEVELS.map((level) => (
                                <Checkbox
                                    key={level.value}
                                    label={level.label}
                                    checked={
                                        filters.experianceLevel === level.value
                                    }
                                    onChange={() =>
                                        handleExperienceLevelChange(level.value)
                                    }
                                    radius="md"
                                />
                            ))}
                        </Stack>
                    </Box>

                    <Box>
                        <Group justify="space-between" mb="xs">
                            <Text size="sm" fw={500}>
                                {t('salaryRange')}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {(filters.salaryFrom ?? 0).toLocaleString()} -{' '}
                                {(filters.salaryTo ?? 0).toLocaleString()} ETB
                            </Text>
                        </Group>
                        <RangeSlider
                            value={[
                                filters.salaryFrom ?? 0,
                                filters.salaryTo ?? 0,
                            ]}
                            onChange={(value) =>
                                setFilters({
                                    ...filters,
                                    salaryFrom: value[0],
                                    salaryTo: value[1],
                                })
                            }
                            min={0}
                            max={100000}
                            step={1000}
                            radius="md"
                            marks={[
                                { value: 0, label: '0' },
                                { value: 25000, label: '25K' },
                                { value: 50000, label: '50K' },
                                { value: 75000, label: '75K' },
                                { value: 100000, label: '100K+' },
                            ]}
                        />
                    </Box>
                </Stack>
            </ScrollArea>

            <Button
                variant="filled"
                fullWidth
                mt="md"
                onClick={handleApplyFilters}
                radius="md"
                color="blue"
                leftSection={<IconFilter size={16} />}
            >
                {t('applyFilters')}
            </Button>
        </Paper>
    );
};

export default function JobsPage() {
    const { user } = useAuth();
    const locale = useLocale();
    const t = useTranslations('jobListing');
    const isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter();

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
        salaryFrom: 0,
        salaryTo: 100000,
    });

    const [opened, setOpened] = useState(false);

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
        }
    }, 300);

    const handleApplyFilters = () => {
        const updatedParams = {
            ...entityParams,
            p: 1,
            s: filters.title || undefined,
            location: filters.cityId || undefined,
            type: filters.type || undefined,
            experience: filters.experianceLevel || undefined,
            salaryFrom: filters.salaryFrom || undefined,
            salaryTo: filters.salaryTo || undefined,
        };

        setEntityParams(updatedParams);

        setFilters((prev) => ({
            ...prev,
            pagination: {
                ...prev.pagination,
                page: 1,
            },
        }));
    };

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
        }
    }, [user, router]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['job-seeker-jbs', entityParamSerializer(entityParams)],
        queryFn: () => fetchJobs(filters),
    });

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (error) {
        return <Text color="red">Error loading jobs</Text>;
    }

    const activeFilters = calculateActiveFilters(filters);

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
            salaryFrom: 0,
            salaryTo: 100000,
        });
    };

    return (
        <>
            <Container size="xl" py="xl">
                <Grid>
                    <Grid.Col span={{ base: 12, md: 3 }}>
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
                            <Card className="flex items-center space-between w-full">
                                <Title order={2}>{t('jobListings')}</Title>
                                <Box className="md:hidden">
                                    <Drawer
                                        opened={opened}
                                        onClose={() => setOpened(false)}
                                        title={t('filterJobs')}
                                        position="left"
                                        size="sm"
                                        padding="md"
                                    >
                                        <Box py="md">
                                            <Title order={3} mb="lg">
                                                {t('filters')}
                                            </Title>
                                            <JobFilterSidebar
                                                filters={filters}
                                                onFilterChange={setFilters}
                                                onJobTypeChange={
                                                    handleJobTypeChange
                                                }
                                                onExperienceLevelChange={
                                                    handleExperienceLevelChange
                                                }
                                                onReset={resetFilters}
                                            />
                                        </Box>
                                    </Drawer>
                                    <Button
                                        leftSection={<IconFilter size={18} />}
                                        onClick={() => setOpened(true)}
                                        radius="md"
                                        variant="outline"
                                        fullWidth
                                    >
                                        {t('filterJobs')}
                                    </Button>
                                </Box>
                            </Card>

                            {activeFilters > 0 && (
                                <FilterChips
                                    filters={filters}
                                    setFilters={setFilters}
                                />
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                {data?.data && data.data.length > 0 ? (
                                    data.data.map((job) => (
                                        <div
                                            key={job.id}
                                            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
                                        >
                                            {/* Featured badge */}
                                            {job.id === '1' && (
                                                <div className="absolute top-0 right-0">
                                                    <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center">
                                                        <IconStar
                                                            size={14}
                                                            className="mr-1"
                                                        />
                                                        Featured
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-6">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mr-4">
                                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                                                            <Avatar
                                                                size="md"
                                                                color="purple"
                                                                radius="md"
                                                                className="object-contain"
                                                            >
                                                                {job.organization?.name.slice(
                                                                    0,
                                                                    2,
                                                                )}
                                                            </Avatar>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                                            <div>
                                                                <Text
                                                                    component="h3"
                                                                    size="lg"
                                                                    fw={600}
                                                                    className="text-gray-900 hover:text-purple-600 transition-colors cursor-pointer"
                                                                    onClick={() =>
                                                                        router.push(
                                                                            `/jobs/${job.id}`,
                                                                        )
                                                                    }
                                                                >
                                                                    {job.title}
                                                                </Text>
                                                                <Text
                                                                    size="sm"
                                                                    fw={500}
                                                                    c="dimmed"
                                                                    className="mt-1"
                                                                >
                                                                    {
                                                                        job
                                                                            .organization
                                                                            ?.name
                                                                    }
                                                                </Text>
                                                            </div>
                                                            <div className="mt-2 md:mt-0 text-sm text-gray-500 flex items-center">
                                                                <IconClock
                                                                    size={16}
                                                                    className="mr-1 text-purple-500"
                                                                />
                                                                <Text size="sm">
                                                                    {
                                                                        job.createdAt
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 flex flex-wrap gap-y-2">
                                                            <div className="flex items-center text-sm text-gray-500 mr-4">
                                                                <IconMapPin
                                                                    size={16}
                                                                    className="mr-1 text-purple-500"
                                                                />
                                                                <Text size="sm">
                                                                    Remote
                                                                </Text>
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-500 mr-4">
                                                                <IconBriefcase
                                                                    size={16}
                                                                    className="mr-1 text-purple-500"
                                                                />
                                                                <Text size="sm">
                                                                    {job.type}
                                                                </Text>
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <IconCurrencyDollar
                                                                    size={16}
                                                                    className="mr-1 text-purple-500"
                                                                />
                                                                <Text size="sm">
                                                                    {job.salaryFrom.toLocaleString()}{' '}
                                                                    -{' '}
                                                                    {job.salaryTo.toLocaleString()}{' '}
                                                                    {
                                                                        job.currency
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </div>

                                                        <Group gap="xs" mt="md">
                                                            <Badge
                                                                color="purple"
                                                                variant="light"
                                                                radius="sm"
                                                            >
                                                                {job.experienceLevel ||
                                                                    'Any Experience'}
                                                            </Badge>
                                                        </Group>

                                                        <Box mt="md">
                                                            <TypographyStylesProvider>
                                                                <Text
                                                                    size="sm"
                                                                    lineClamp={
                                                                        2
                                                                    }
                                                                    className="text-gray-600"
                                                                >
                                                                    {parse(
                                                                        job.description,
                                                                    )}
                                                                </Text>
                                                            </TypographyStylesProvider>
                                                        </Box>

                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            <Button
                                                                variant="gradient"
                                                                gradient={{
                                                                    from: 'primary',
                                                                    to: 'blue',
                                                                }}
                                                                radius="md"
                                                                onClick={() =>
                                                                    router.push(
                                                                        `/jobs/${job.id}`,
                                                                    )
                                                                }
                                                            >
                                                                View Details
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                color="purple"
                                                                radius="md"
                                                            >
                                                                Apply Now
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                color="gray"
                                                                radius="md"
                                                                leftSection={
                                                                    <IconBookmark
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                }
                                                                className="ml-auto"
                                                            >
                                                                Save
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom border with gradient */}
                                            <div className="h-1 w-full bg-gradient-to-r from-primary to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                        </div>
                                    ))
                                ) : (
                                    <Card className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-gray-50 to-white border-0 animate-fade-in">
                                        <div className="bg-white p-8 rounded-full mb-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
                                            <div className="relative">
                                                <IconBriefcase
                                                    size={56}
                                                    className="text-primary animate-bounce-slow"
                                                />
                                                <div className="absolute -top-2 -right-2 bg-blue-100 rounded-full p-2">
                                                    <IconSearch
                                                        size={16}
                                                        className="text-blue-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Text
                                            size="2xl"
                                            fw={700}
                                            className="text-gray-800 mb-3 text-center"
                                        >
                                            {t('noJobsFound')}
                                        </Text>
                                        <Text
                                            size="sm"
                                            c="dimmed"
                                            className="text-center max-w-md mb-8 leading-relaxed"
                                        >
                                            {t('noJobsFoundDescription')}
                                        </Text>
                                        <div className="flex gap-4">
                                            <Button
                                                variant="filled"
                                                color="blue"
                                                radius="xl"
                                                size="md"
                                                leftSection={
                                                    <IconFilter size={16} />
                                                }
                                                onClick={() => {
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
                                                        salaryFrom: 0,
                                                        salaryTo: 100000,
                                                    });
                                                }}
                                                className="hover:scale-105 transition-transform duration-200"
                                            >
                                                {t('resetFilters')}
                                            </Button>
                                            <Button
                                                variant="light"
                                                color="gray"
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

                            <EntityPagination
                                entity="job-seeker-jbs"
                                total={data?.total ?? 0}
                            />
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>

            <Footer />
        </>
    );
}

function JobFilterSidebar({
    filters,
    onFilterChange,
    onJobTypeChange,
    onExperienceLevelChange,
    onReset,
}: {
    filters: Filter;
    onFilterChange: (filters: Filter) => void;
    onJobTypeChange: (value: string) => void;
    onExperienceLevelChange: (value: string) => void;
    onReset: () => void;
}) {
    const t = useTranslations('jobListing');

    return (
        <ScrollArea h={500} scrollbarSize={6}>
            <Stack gap="lg" p="xs">
                <Paper p="md" radius="md" withBorder>
                    <Text size="sm" fw={600} mb="sm" c="blue.7">
                        {t('keyword')}
                    </Text>
                    <TextInput
                        value={filters.title || ''}
                        onChange={(e) =>
                            onFilterChange({
                                ...filters,
                                title: e.target.value,
                            })
                        }
                        placeholder="Search jobs..."
                        leftSection={<IconSearch size={16} stroke={1.5} />}
                        radius="md"
                        size="sm"
                    />
                </Paper>

                <Paper p="md" radius="md" withBorder>
                    <Text size="sm" fw={600} mb="sm" c="blue.7">
                        {t('location')}
                    </Text>
                    <Select
                        value={filters.cityId || ''}
                        onChange={(value) =>
                            onFilterChange({
                                ...filters,
                                cityId: value || '',
                            })
                        }
                        placeholder="Select location"
                        data={LOCATIONS}
                        leftSection={<IconMapPin size={16} stroke={1.5} />}
                        radius="md"
                        searchable
                        clearable
                        size="sm"
                    />
                </Paper>

                <Paper p="md" radius="md" withBorder>
                    <Text size="sm" fw={600} mb="sm" c="blue.7">
                        {t('jobType')}
                    </Text>
                    <Group gap="xs" wrap="wrap">
                        {JOB_TYPES.map((type) => (
                            <Chip
                                key={type.value}
                                checked={filters.type === type.value}
                                onChange={() => onJobTypeChange(type.value)}
                                radius="md"
                                variant="filled"
                                color={
                                    filters.type === type.value
                                        ? 'blue'
                                        : 'gray'
                                }
                                size="sm"
                            >
                                {type.label}
                            </Chip>
                        ))}
                    </Group>
                </Paper>

                <Paper p="md" radius="md" withBorder>
                    <Text size="sm" fw={600} mb="sm" c="blue.7">
                        {t('experienceLevel')}
                    </Text>
                    <Group gap="xs" wrap="wrap">
                        {EXPERIENCE_LEVELS.map((level) => (
                            <Chip
                                key={level.value}
                                checked={
                                    filters.experianceLevel === level.value
                                }
                                onChange={() =>
                                    onExperienceLevelChange(level.value)
                                }
                                radius="md"
                                variant="filled"
                                color={
                                    filters.experianceLevel === level.value
                                        ? 'blue'
                                        : 'gray'
                                }
                                size="sm"
                            >
                                {level.label}
                            </Chip>
                        ))}
                    </Group>
                </Paper>

                <Paper p="md" radius="md" withBorder>
                    <Group justify="space-between" mb="sm">
                        <Text size="sm" fw={600} c="blue.7">
                            {t('salaryRange')}
                        </Text>
                        <Badge radius="sm" color="blue">
                            {(filters.salaryFrom || 0).toLocaleString()} -{' '}
                            {(filters.salaryTo || 0).toLocaleString()} ETB
                        </Badge>
                    </Group>
                    <RangeSlider
                        value={[filters.salaryFrom || 0, filters.salaryTo || 0]}
                        onChange={(value) =>
                            onFilterChange({
                                ...filters,
                                salaryFrom: value[0],
                                salaryTo: value[1],
                            })
                        }
                        min={0}
                        max={100000}
                        step={1000}
                        radius="md"
                        color="blue"
                        marks={[
                            { value: 0, label: '0' },
                            { value: 25000, label: '25K' },
                            { value: 50000, label: '50K' },
                            { value: 75000, label: '75K' },
                            { value: 100000, label: '100K+' },
                        ]}
                    />
                </Paper>

                <Group mt="md" gap="sm">
                    <Button
                        variant="filled"
                        fullWidth
                        onClick={onReset}
                        radius="md"
                        color="gray"
                        leftSection={<IconX size={16} />}
                    >
                        {t('resetFilters')}
                    </Button>
                </Group>
            </Stack>
        </ScrollArea>
    );
}

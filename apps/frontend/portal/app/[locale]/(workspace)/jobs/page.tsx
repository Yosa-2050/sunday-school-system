'use client';

import { Footer } from '@/components/Footer';
import { useRouter } from '@/i18n/routing';
import {
    ActionIcon,
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
    Tooltip,
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
    IconAdjustments,
    IconBriefcase,
    IconBuilding,
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

const JOB_TYPES = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
];

const EXPERIENCE_LEVELS = [
    'Entry Level',
    'Junior',
    'Mid Level',
    'Senior',
    'Lead',
    'Manager',
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

    const [filters, setFilters] = useState<JobFilters>({
        location: '',
        jobType: [],
        salaryRange: [0, 100000],
        experienceLevel: [],
        keyword: '',
    });

    const [opened, setOpened] = useState(false);

    const handleSearch = useDebouncedCallback((term: string | null) => {
        if (term) {
            setEntityParams({ ...entityParams, p: 1, s: term });
        } else {
            const updatedParams = { ...entityParams };
            updatedParams.s = undefined;
            setEntityParams({ ...updatedParams, p: 1 });
        }
    }, 300);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
        }
    }, [user, router]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['job-seeker-jbs', entityParamSerializer(entityParams)],
        queryFn: () => fetchJobs(entityParamSerializer(entityParams)),
    });

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (error) {
        return <Text color="red">Error loading jobs</Text>;
    }

    const activeFilters = Object.entries(filters).filter(([key, value]) => {
        if (key === 'salaryRange') {
            return value[0] > 0 || value[1] < 100000;
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value !== '';
    }).length;

    const handleJobTypeChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            jobType: prev.jobType.includes(value)
                ? prev.jobType.filter((type) => type !== value)
                : [...prev.jobType, value],
        }));
    };

    const handleExperienceLevelChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            experienceLevel: prev.experienceLevel.includes(value)
                ? prev.experienceLevel.filter((level) => level !== value)
                : [...prev.experienceLevel, value],
        }));
    };

    const resetFilters = () => {
        setFilters({
            location: '',
            jobType: [],
            salaryRange: [0, 100000],
            experienceLevel: [],
            keyword: '',
        });
    };

    return (
        <>
            <Container size="xl" py="xl">
                <Grid>
                    <Grid.Col span={{ base: 12, md: 3 }}>
                        <Paper
                            p="md"
                            radius="lg"
                            shadow="sm"
                            className="sticky top-4"
                        >
                            <Group
                                justify="space-between"
                                align="center"
                                mb="md"
                            >
                                <Group gap="xs">
                                    <IconAdjustments size={20} />
                                    <Title order={4} fw={600}>
                                        {t('filterLabel')}
                                    </Title>
                                </Group>
                                {activeFilters > 0 && (
                                    <Tooltip label="Clear all filters">
                                        <ActionIcon
                                            variant="subtle"
                                            color="gray"
                                            onClick={resetFilters}
                                        >
                                            <IconX size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                )}
                            </Group>

                            <ScrollArea h={isMobile ? 400 : 600}>
                                <Stack gap="md">
                                    <Box>
                                        <Text size="sm" fw={500} mb="xs">
                                            {t('keyword')}
                                        </Text>
                                        <TextInput
                                            value={filters.keyword}
                                            onChange={(e) =>
                                                setFilters({
                                                    ...filters,
                                                    keyword: e.target.value,
                                                })
                                            }
                                            placeholder="Search jobs..."
                                            leftSection={
                                                <IconSearch size={16} />
                                            }
                                            radius="md"
                                        />
                                    </Box>

                                    <Box>
                                        <Text size="sm" fw={500} mb="xs">
                                            {t('location')}
                                        </Text>
                                        <Select
                                            value={filters.location}
                                            onChange={(value) =>
                                                setFilters({
                                                    ...filters,
                                                    location: value || '',
                                                })
                                            }
                                            placeholder="Select location"
                                            data={LOCATIONS}
                                            leftSection={
                                                <IconMapPin size={16} />
                                            }
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
                                                    key={type}
                                                    label={type}
                                                    checked={filters.jobType.includes(
                                                        type,
                                                    )}
                                                    onChange={() =>
                                                        handleJobTypeChange(
                                                            type,
                                                        )
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
                                                    key={level}
                                                    label={level}
                                                    checked={filters.experienceLevel.includes(
                                                        level,
                                                    )}
                                                    onChange={() =>
                                                        handleExperienceLevelChange(
                                                            level,
                                                        )
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
                                                {filters.salaryRange[0].toLocaleString()}{' '}
                                                -{' '}
                                                {filters.salaryRange[1].toLocaleString()}{' '}
                                                ETB
                                            </Text>
                                        </Group>
                                        <RangeSlider
                                            value={filters.salaryRange}
                                            onChange={(value) =>
                                                setFilters({
                                                    ...filters,
                                                    salaryRange: value as [
                                                        number,
                                                        number,
                                                    ],
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
                                                {
                                                    value: 100000,
                                                    label: '100K+',
                                                },
                                            ]}
                                        />
                                    </Box>
                                </Stack>
                            </ScrollArea>

                            <Button
                                variant="filled"
                                fullWidth
                                mt="md"
                                onClick={() => handleSearch(filters.keyword)}
                                radius="md"
                            >
                                Apply Filters
                            </Button>
                        </Paper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 9 }}>
                        <Stack gap="md">
                            <Group justify="space-between" align="center">
                                <Title order={2}>{t('jobListings')}</Title>
                                {isMobile && (
                                    <Button
                                        leftSection={<IconFilter size={18} />}
                                        onClick={() => setOpened(true)}
                                        radius="md"
                                    >
                                        {t('filterJobs')}
                                    </Button>
                                )}
                            </Group>

                            {activeFilters > 0 && (
                                <Group gap="xs" wrap="wrap">
                                    {filters.keyword && (
                                        <Chip
                                            checked
                                            variant="light"
                                            radius="xl"
                                            onClick={() =>
                                                setFilters({
                                                    ...filters,
                                                    keyword: '',
                                                })
                                            }
                                        >
                                            Keyword: {filters.keyword}
                                        </Chip>
                                    )}
                                    {filters.location && (
                                        <Chip
                                            checked
                                            variant="light"
                                            radius="xl"
                                            onClick={() =>
                                                setFilters({
                                                    ...filters,
                                                    location: '',
                                                })
                                            }
                                        >
                                            Location: {filters.location}
                                        </Chip>
                                    )}
                                    {filters.jobType.length > 0 && (
                                        <Chip
                                            checked
                                            variant="light"
                                            radius="xl"
                                            onClick={() =>
                                                setFilters({
                                                    ...filters,
                                                    jobType: [],
                                                })
                                            }
                                        >
                                            Job Types: {filters.jobType.length}
                                        </Chip>
                                    )}
                                    {filters.experienceLevel.length > 0 && (
                                        <Chip
                                            checked
                                            variant="light"
                                            radius="xl"
                                            onClick={() =>
                                                setFilters({
                                                    ...filters,
                                                    experienceLevel: [],
                                                })
                                            }
                                        >
                                            Experience:{' '}
                                            {filters.experienceLevel.length}
                                        </Chip>
                                    )}
                                    {(filters.salaryRange[0] > 0 ||
                                        filters.salaryRange[1] < 100000) && (
                                        <Chip
                                            checked
                                            variant="light"
                                            radius="xl"
                                            onClick={() =>
                                                setFilters({
                                                    ...filters,
                                                    salaryRange: [0, 100000],
                                                })
                                            }
                                        >
                                            Salary:{' '}
                                            {filters.salaryRange[0].toLocaleString()}{' '}
                                            -{' '}
                                            {filters.salaryRange[1].toLocaleString()}{' '}
                                            ETB
                                        </Chip>
                                    )}
                                </Group>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                {data?.data.map((job) => (
                                    <Card
                                        key={job.id}
                                        withBorder
                                        radius="lg"
                                        shadow="sm"
                                        padding={isMobile ? 'md' : 'xl'}
                                        className="hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <Grid>
                                            <Grid.Col
                                                span={{ base: 12, md: 9 }}
                                            >
                                                <Group
                                                    gap="md"
                                                    align="flex-start"
                                                >
                                                    <Avatar
                                                        size={
                                                            isMobile
                                                                ? 'md'
                                                                : 'lg'
                                                        }
                                                        color="blue"
                                                        radius="xl"
                                                        className="bg-blue-50"
                                                    >
                                                        {job.organization?.name.slice(
                                                            0,
                                                            2,
                                                        )}
                                                    </Avatar>
                                                    <Stack gap="xs">
                                                        <Title
                                                            order={
                                                                isMobile ? 5 : 4
                                                            }
                                                            className="font-semibold line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
                                                            onClick={() =>
                                                                router.push(
                                                                    `/jobs/${job.id}`,
                                                                )
                                                            }
                                                        >
                                                            {job.title}
                                                        </Title>
                                                        <Group gap="xs">
                                                            <Text
                                                                size="sm"
                                                                c="dimmed"
                                                                className="flex items-center gap-1"
                                                            >
                                                                <IconBuilding
                                                                    size={14}
                                                                />
                                                                {
                                                                    job
                                                                        .organization
                                                                        ?.name
                                                                }
                                                            </Text>
                                                            <Text
                                                                size="sm"
                                                                c="dimmed"
                                                                className="flex items-center gap-1"
                                                            >
                                                                <IconMapPin
                                                                    size={14}
                                                                />
                                                                Remote
                                                            </Text>
                                                        </Group>
                                                    </Stack>
                                                </Group>

                                                <Group mt="md" gap="xs">
                                                    <Badge
                                                        color="blue"
                                                        variant="light"
                                                        leftSection={
                                                            <IconBriefcase
                                                                size={14}
                                                            />
                                                        }
                                                        radius="xl"
                                                    >
                                                        {job.type}
                                                    </Badge>
                                                    <Badge
                                                        color="teal"
                                                        variant="light"
                                                        leftSection={
                                                            <IconCurrencyDollar
                                                                size={14}
                                                            />
                                                        }
                                                        radius="xl"
                                                    >
                                                        {job.salaryFrom.toLocaleString()}{' '}
                                                        -{' '}
                                                        {job.salaryTo.toLocaleString()}{' '}
                                                        {job.currency}
                                                    </Badge>
                                                    <Badge
                                                        color="grape"
                                                        variant="light"
                                                        leftSection={
                                                            <IconStar
                                                                size={14}
                                                            />
                                                        }
                                                        radius="xl"
                                                    >
                                                        Any Experience
                                                    </Badge>
                                                </Group>

                                                <TypographyStylesProvider mt="md">
                                                    <Box className="prose prose-stone max-w-none px-2.5 line-clamp-2 overflow-hidden">
                                                        {parse(job.description)}
                                                    </Box>
                                                </TypographyStylesProvider>
                                            </Grid.Col>

                                            <Grid.Col
                                                span={{ base: 12, md: 3 }}
                                            >
                                                <Stack
                                                    gap="sm"
                                                    align="flex-end"
                                                >
                                                    <Text
                                                        size="xs"
                                                        c="dimmed"
                                                        className="flex items-center gap-1"
                                                    >
                                                        <IconClock size={14} />
                                                        {job.createdAt}
                                                    </Text>
                                                    <Button
                                                        variant="filled"
                                                        size={
                                                            isMobile
                                                                ? 'sm'
                                                                : 'md'
                                                        }
                                                        fullWidth
                                                        onClick={() =>
                                                            router.push(
                                                                `/jobs/${job.id}`,
                                                            )
                                                        }
                                                        radius="md"
                                                    >
                                                        Apply Now
                                                    </Button>
                                                </Stack>
                                            </Grid.Col>
                                        </Grid>
                                    </Card>
                                ))}
                            </div>

                            <EntityPagination
                                entity="job-seeker-jbs"
                                total={data?.total ?? 0}
                            />
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>

            <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                title={t('filterJobs')}
                position="right"
                size="sm"
                padding="md"
            >
                <JobFilterSidebar
                    filters={filters}
                    onFilterChange={setFilters}
                    onJobTypeChange={handleJobTypeChange}
                    onExperienceLevelChange={handleExperienceLevelChange}
                    onReset={resetFilters}
                />
            </Drawer>

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
    filters: JobFilters;
    onFilterChange: (filters: JobFilters) => void;
    onJobTypeChange: (value: string) => void;
    onExperienceLevelChange: (value: string) => void;
    onReset: () => void;
}) {
    const t = useTranslations('jobListing');

    return (
        <ScrollArea h={400}>
            <Stack gap="md">
                <Box>
                    <Text size="sm" fw={500} mb="xs">
                        {t('keyword')}
                    </Text>
                    <TextInput
                        value={filters.keyword}
                        onChange={(e) =>
                            onFilterChange({
                                ...filters,
                                keyword: e.target.value,
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
                        value={filters.location}
                        onChange={(value) =>
                            onFilterChange({
                                ...filters,
                                location: value || '',
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
                                key={type}
                                label={type}
                                checked={filters.jobType.includes(type)}
                                onChange={() => onJobTypeChange(type)}
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
                                key={level}
                                label={level}
                                checked={filters.experienceLevel.includes(
                                    level,
                                )}
                                onChange={() => onExperienceLevelChange(level)}
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
                            {filters.salaryRange[0].toLocaleString()} -{' '}
                            {filters.salaryRange[1].toLocaleString()} ETB
                        </Text>
                    </Group>
                    <RangeSlider
                        value={filters.salaryRange}
                        onChange={(value) =>
                            onFilterChange({
                                ...filters,
                                salaryRange: value as [number, number],
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

                <Button
                    variant="filled"
                    fullWidth
                    mt="md"
                    onClick={onReset}
                    radius="md"
                >
                    {t('resetFilters')}
                </Button>
            </Stack>
        </ScrollArea>
    );
}

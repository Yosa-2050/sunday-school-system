'use client';

import { Footer } from '@/components/Footer';
import { redirect, useRouter } from '@/i18n/routing';
import {
    Avatar,
    Badge,
    Button,
    Card,
    Container,
    Divider,
    Flex,
    Group,
    LoadingOverlay,
    Paper,
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
import { useAuth } from '@shega/ui';
import {
    IconBriefcase,
    IconCurrencyDollar,
    IconMapPin,
    IconSearch,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from 'app/_api/jobs/fetch-jobs';
import { useLocale, useTranslations } from 'next-intl';
import { parseAsJson, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

// Types
interface JobFilters {
    location: string;
    jobType: string;
    salaryRange: string;
    experienceLevel: string;
    keyword: string;
}

interface Job {
    id: number;
    title: string;
    organization: { name: string };
    type: string;
    salaryTo: string;
    description: string;
    createdAt: string;
}

export default function HomePage() {
    const { user } = useAuth();
    const locale = useLocale();
    const t = useTranslations('jobListing');
    const router = useRouter();

    const [entityParams, setEntityParams] = useQueryState(
        'job-seeker-jbs',
        parseAsJson(entityParamSchema.parse),
    );

    const handleSearch = useDebouncedCallback((term: string | null) => {
        if (term) {
            router.push(`/jobs?search=${encodeURIComponent(term)}`);
        } else {
            router.push('/jobs');
        }
    }, 300);
    const [filters, setFilters] = useState<JobFilters>({
        location: '',
        jobType: '',
        salaryRange: '',
        experienceLevel: '',
        keyword: '',
    });

    useEffect(() => {
        if (!user) {
            redirect({ href: '/auth/login', locale });
        }
    }, [user, locale]);

    return (
        <>
            <div className="relative">
                <div
                    className="py-12 md:py-20 bg-cover bg-center relative h-[70vh]"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                    <Container size="xl" className="relative z-10">
                        <Stack gap="lg" className="max-w-xl mt-20">
                            <Title className="text-4xl md:text-6xl font-bold text-white">
                                Find The Job That Fits Your Life
                            </Title>
                            <Text size="lg" c="gray.2">
                                Shega Jobs makes finding your ideal career
                                simple and fast. Browse diverse job listings and
                                kickstart your professional journey today.
                            </Text>
                        </Stack>

                        <Group
                            gap="sm"
                            mt="lg"
                            className="max-w-5xl bg-white rounded-lg p-2 shadow-lg border-none"
                        >
                            <TextInput
                                size="lg"
                                placeholder="Job title, keywords or organization"
                                value={filters.keyword}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        keyword: e.target.value,
                                    })
                                }
                                leftSection={<IconSearch size={24} />}
                                className="flex-1 p-2"
                                styles={{
                                    input: {
                                        border: 'none', // Target the input element directly
                                    },
                                }}
                            />
                            <Select
                                size="lg"
                                placeholder="All Location"
                                data={[]}
                                value={filters.location}
                                onChange={(value) =>
                                    setFilters({
                                        ...filters,
                                        location: value || '',
                                    })
                                }
                                leftSection={<IconMapPin size={24} />}
                                className="flex-1 p-2"
                                styles={{
                                    input: {
                                        border: 'none', // Target the input element directly
                                    },
                                }}
                            />
                            <Button
                                size="lg"
                                className="border-none"
                                onClick={() => handleSearch(filters.keyword)}
                            >
                                Find Jobs
                            </Button>
                        </Group>

                        {/* <Group gap="sm" mt="md">
              {[
                "Designer",
                "Developer",
                "Tester",
                "Writing",
                "Project Manager",
              ].map((keyword) => (
                <Anchor
                  key={keyword}
                  href="#"
                  className="text-gray-200 hover:text-white text-sm"
                >
                  {keyword}
                </Anchor>
              ))}
            </Group> */}
                    </Container>
                </div>
            </div>

            <Container size="xl" mt="md">
                <Title className="text-2xl font-bold my-4" c="dimmed">
                    Recent Jobs
                </Title>
                <Divider mb={'md'} />
                <JobList filters={filters} />
                {/* <Grid className="mt-3">
                    <Grid.Col span={{ base: 12 }}>
                        {isMobile && (
                            <Button
                                fullWidth
                                leftSection={<IconFilter size={18} />}
                                onClick={() => setOpened(true)}
                                mb="md"
                            >
                                Filter Jobs
                            </Button>
                        )}
                        <JobList filters={filters} />
                    </Grid.Col>
                </Grid> */}
            </Container>

            <Footer />

            {/* <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                title="Filter Jobs"
                position="right"
                size="sm"
                padding="md"
            >
                <JobFilterSidebar
                    filters={filters}
                    onFilterChange={setFilters}
                />
            </Drawer> */}
        </>
    );
}

// Components
function JobList({ filters }: { filters: JobFilters }) {
    const router = useRouter();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [entityParams, setEntityParams] = useQueryState(
        'job-seeker-jbs',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: PER_PAGE,
            //   f: [{ f: "applied", v: "false", o: "eq" }],
        }),
    );

    const { data, isLoading, error } = useQuery({
        queryKey: ['job-seeker-jbs', entityParamSerializer(entityParams)],
        queryFn: () =>
            fetchJobs({
                pagination: {
                    page: 1,
                    limit: 5,
                },
            }),
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
                <Card
                    key={job.id}
                    withBorder
                    radius="md"
                    shadow="sm"
                    padding={isMobile ? 'sm' : 'lg'}
                    className="hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                >
                    <Group justify="space-between" align="flex-start">
                        <Group gap="sm">
                            <Flex
                                align={'center'}
                                justify={'space-between'}
                                w={'100%'}
                            >
                                <div className="flex items-center flex-1">
                                    <Avatar
                                        size={isMobile ? 'sm' : 'lg'}
                                        color="blue"
                                        radius="xl"
                                    >
                                        {job.organization?.name.slice(0, 2)}
                                    </Avatar>
                                    <Title
                                        order={isMobile ? 5 : 4}
                                        className="font-semibold line-clamp-1 cursor-pointer transition-colors"
                                        onClick={() =>
                                            router.push(`/jobs/${job.id}`)
                                        }
                                    >
                                        {job.title}
                                    </Title>
                                </div>
                                {job.applied && <Badge>Applied</Badge>}
                            </Flex>
                            <Text size="sm" c="dimmed" className="line-clamp-1">
                                {job.organization?.name}
                            </Text>
                        </Group>
                    </Group>

                    <Group mt="sm" gap="xs">
                        <Badge
                            color="green"
                            variant="light"
                            leftSection={<IconBriefcase size={14} />}
                        >
                            {job.type}
                        </Badge>
                        <Badge color="teal" variant="light">
                            {job.salaryFrom.toLocaleString()} -{' '}
                            {job.salaryTo.toLocaleString()} {job.currency}
                        </Badge>
                    </Group>

                    <TypographyStylesProvider mt="md">
                        <div
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                            dangerouslySetInnerHTML={{
                                __html: job.description,
                            }}
                            className="line-clamp-2 text-sm text-gray-600"
                        />
                    </TypographyStylesProvider>

                    <Divider my="sm" />

                    <Flex
                        justify={job.createdAt ? 'space-between' : 'flex-end'}
                        align="center"
                    >
                        {job.createdAt && (
                            <Text size="xs" c="dimmed">
                                {job.createdAt}
                            </Text>
                        )}
                        <Button
                            variant="filled"
                            size={isMobile ? 'sm' : 'md'}
                            fullWidth={isMobile}
                            onClick={() => router.push(`/jobs/${job.id}`)}
                            className="transition-colors"
                        >
                            Detail
                        </Button>
                    </Flex>
                </Card>
            ))}

            <div className="col-span-full flex justify-center mt-4">
                <Button
                    variant="light"
                    size="lg"
                    onClick={() => router.push('/jobs')}
                    className="transition-colors"
                >
                    View More Jobs
                </Button>
            </div>
        </div>
    );
}
function JobFilterSidebar({
    filters,
    onFilterChange,
}: {
    filters: JobFilters;
    onFilterChange: (filters: JobFilters) => void;
}) {
    const t = useTranslations('jobListing');

    return (
        <Paper p="md" radius="lg" shadow="sm" className="sticky top-4">
            <Title order={4} mb="md" fw={600}>
                {t('filterLabel')}
            </Title>
            <Stack gap="md">
                <TextInput
                    label={t('location')}
                    value={filters.location}
                    onChange={(e) =>
                        onFilterChange({ ...filters, location: e.target.value })
                    }
                    placeholder="Enter location"
                    leftSection={<IconMapPin size={16} />}
                />
                <TextInput
                    label={t('jobType')}
                    value={filters.jobType}
                    onChange={(e) =>
                        onFilterChange({ ...filters, jobType: e.target.value })
                    }
                    placeholder="Job type"
                    leftSection={<IconBriefcase size={16} />}
                />
                <TextInput
                    label={t('salaryRange')}
                    value={filters.salaryRange}
                    onChange={(e) =>
                        onFilterChange({
                            ...filters,
                            salaryRange: e.target.value,
                        })
                    }
                    placeholder="Salary range"
                    leftSection={<IconCurrencyDollar size={16} />}
                />
                <Button
                    variant="light"
                    fullWidth
                    onClick={() =>
                        onFilterChange({
                            location: '',
                            jobType: '',
                            salaryRange: '',
                            experienceLevel: '',
                            keyword: '',
                        })
                    }
                >
                    {t('resetFilters')}
                </Button>
            </Stack>
        </Paper>
    );
}

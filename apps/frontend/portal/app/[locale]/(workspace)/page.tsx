'use client';

import { Footer } from '@/components/Footer';
import { redirect, useRouter } from '@/i18n/routing';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Container,
    Divider,
    Flex,
    Group,
    LoadingOverlay,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
    TypographyStylesProvider,
} from '@mantine/core';
import { useDebouncedCallback, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
    PER_PAGE,
    entityParamSchema,
    entityParamSerializer,
} from '@shega/shared';
import { useAuth } from '@shega/ui';
import { IconBriefcase, IconHeart, IconSearch } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchJobs, likeJob, unlikeJob } from 'app/_api/jobs/fetch-jobs';
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
                    className="py-12 md:py-24 bg-cover bg-center relative h-[70vh]"
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

                        <Stack
                            gap="sm"
                            mt="lg"
                            className="max-w-5xl md:hidden"
                            hiddenFrom="md"
                        >
                            <Paper withBorder p="sm" radius="lg" shadow="sm">
                                <Group gap="sm">
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
                                        className="flex-1"
                                        variant="unstyled"
                                    />
                                    <Button
                                        size="lg"
                                        radius="lg"
                                        onClick={() =>
                                            handleSearch(filters.keyword)
                                        }
                                    >
                                        Find Jobs
                                    </Button>
                                </Group>
                            </Paper>
                        </Stack>

                        <Paper
                            withBorder
                            className="max-w-5xl hidden md:flex"
                            mt="lg"
                            visibleFrom="md"
                        >
                            <Group
                                gap="sm"
                                className="max-w-5xl rounded-lg p-2 shadow-lg border-none flex"
                                wrap="nowrap"
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
                                            border: 'none',
                                        },
                                    }}
                                />
                                <Button
                                    size="lg"
                                    className="border-none"
                                    onClick={() =>
                                        handleSearch(filters.keyword)
                                    }
                                >
                                    Find Jobs
                                </Button>
                            </Group>
                        </Paper>
                    </Container>
                </div>
            </div>

            <Paper p="md" withBorder={false} className="border-none mt-4">
                <Container size="xl">
                    <Title className="text-2xl font-bold my-4" c="dimmed">
                        Recent Jobs
                    </Title>
                    <Divider mb={'md'} />
                    <JobList filters={filters} />
                </Container>
            </Paper>

            <Footer />
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

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['job-seeker-jbs', entityParamSerializer(entityParams)],
        queryFn: () =>
            fetchJobs({
                pagination: {
                    page: 1,
                    limit: 5,
                },
            }),
    });

    const likeMutation = useMutation({
        mutationFn: likeJob,
        mutationKey: ['like-job'],
        onSuccess: () => {
            refetch();
            notifications.show({
                title: 'Job Liked',
                message: 'You have successfully liked the job.',
                color: 'green',
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message:
                    error instanceof Error
                        ? error.message
                        : 'An error occurred while liking the job.',
                color: 'red',
            });
        },
        retry: false,
    });

    const unlikeMutation = useMutation({
        mutationFn: unlikeJob,
        mutationKey: ['unlike-job'],
        onSuccess: () => {
            refetch();
            notifications.show({
                title: 'Job Unliked',
                message: 'You have successfully unliked the job.',
                color: 'green',
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message:
                    error instanceof Error
                        ? error.message
                        : 'An error occurred while unliking the job.',
                color: 'red',
            });
        },
        retry: false,
    });

    const handleLikeUnlike = (saved: boolean, programId: string) => {
        if (saved) {
            unlikeMutation.mutate(programId);
        } else {
            likeMutation.mutate(programId);
        }
    };

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }
    if (error) {
        return <Text color="red">Error loading jobs</Text>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation> */}
            {data?.data.slice(0, 4).map((job) => (
                <Card
                    key={job.id}
                    withBorder
                    radius="md"
                    shadow="sm"
                    padding={isMobile ? 'sm' : 'lg'}
                    className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 max-h-[300px] overflow-hidden"
                >
                    <Group justify="space-between" align="flex-start">
                        <Group gap="sm" className="w-full">
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
                                {job.applied ? (
                                    <Badge>Applied</Badge>
                                ) : (
                                    <Box
                                        onClick={() =>
                                            handleLikeUnlike(
                                                job.saved,
                                                job.programId,
                                            )
                                        }
                                        className="flex items-center justify-end flex-1 cursor-pointer"
                                        hidden
                                    >
                                        <IconHeart
                                            size={20}
                                            className={`text-gray-500 hover:text-primary transition-colors cursor-pointer ${job.saved ? 'fill-primary' : ''}`}
                                        />
                                    </Box>
                                )}
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
                            {(() => {
                                if (job?.salaryFrom && job?.salaryTo) {
                                    return `${job.salaryFrom.toLocaleString()} - ${job.salaryTo.toLocaleString()} ${job.currency}`;
                                }
                                if (job?.salaryFrom) {
                                    return `${job.salaryFrom.toLocaleString()} ${job.currency}`;
                                }
                                return 'N/A';
                            })()}
                        </Badge>
                    </Group>

                    <TypographyStylesProvider mt="md">
                        <div
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                            dangerouslySetInnerHTML={{
                                __html: job.description.replace(
                                    /<[^>]+>/g,
                                    ' ',
                                ), // Remove HTML tags
                            }}
                            className="text-sm text-gray-600"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxHeight: '3em', // Fallback for line clamp
                                lineHeight: '1.5em',
                            }}
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

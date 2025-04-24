'use client';

import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Container,
    Divider,
    Grid,
    Group,
    List,
    Paper,
    Progress,
    SimpleGrid,
    Stack,
    Tabs,
    Text,
    Timeline,
    Title,
    useMantineTheme,
} from '@mantine/core';
import {
    IconAlertCircle,
    IconArchive,
    IconBell,
    IconBriefcase,
    IconBuilding,
    IconCalendar,
    IconChartBar,
    IconChevronLeft,
    IconCircleCheck,
    IconClock,
    IconCurrencyDollar,
    IconDownload,
    IconEdit,
    IconExternalLink,
    IconEye,
    IconMail,
    IconMapPin,
    IconShare,
    IconTrash,
    IconUsers,
    IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchJobsAdminById } from 'app/[locale]/_api/admin/fetch-jobs-by-id';
import parse from 'html-react-parser';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Make params optional with a default value
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export default function JobDetailsPage() {
    const theme = useMantineTheme();
    const params = useParams();
    const jobId = params.id as string;

    const { data: job, isLoading } = useQuery({
        queryKey: ['job', jobId],
        queryFn: () => fetchJobsAdminById(jobId),
    });

    // In a real application, you would fetch the job data based on the ID
    const jobData = {
        id: jobId,
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        companyLogo: '/placeholder.svg?height=40&width=40',
        location: 'San Francisco, CA (Remote)',
        type: 'Full-time',
        salary: '$120,000 - $150,000',
        postedDate: 'March 15, 2025',
        expiryDate: 'May 15, 2025',
        status: 'Active',
        description:
            'We are looking for a Senior Frontend Developer to join our team. The ideal candidate will have experience with React, TypeScript, and modern frontend frameworks.',
        requirements: [
            '5+ years of experience in frontend development',
            'Strong proficiency in React, TypeScript, and modern JavaScript',
            'Experience with state management libraries (Redux, MobX, etc.)',
            'Knowledge of responsive design and cross-browser compatibility',
            'Excellent problem-solving skills and attention to detail',
        ],
        responsibilities: [
            'Develop and maintain frontend applications using React and TypeScript',
            'Collaborate with designers and backend developers to implement features',
            'Optimize applications for maximum speed and scalability',
            'Write clean, maintainable, and well-documented code',
            'Participate in code reviews and provide constructive feedback',
        ],
        benefits: [
            'Competitive salary and equity',
            'Health, dental, and vision insurance',
            'Flexible work hours and remote work options',
            'Professional development budget',
            '401(k) matching',
        ],
        stats: {
            views: 1245,
            applicants: 78,
            shortlisted: 12,
            interviewed: 5,
            rejected: 8,
            hired: 0,
            daysRemaining: 42,
            conversionRate: 6.3,
        },
    };

    const statusStyles = {
        APPROVED: 'bg-green-500',
        DECLINED: 'bg-red-500',
        WAITINGAPPROVAL: 'bg-yellow-500',
    };

    const statusText = {
        APPROVED: 'Approved',
        DECLINED: 'Declined',
        WAITINGAPPROVAL: 'Waiting Approval',
    };

    return (
        <Container size="xl" py="xl" px="md">
            <Group mb="xl">
                <Link href="/work-provider/jobs" passHref>
                    <Button
                        variant="subtle"
                        leftSection={<IconChevronLeft size={16} />}
                        component="a"
                        color="gray"
                    >
                        Back to List
                    </Button>
                </Link>
            </Group>

            {/* Header Section */}
            <Paper
                p="xl"
                mb="xl"
                radius="lg"
                style={{
                    background: 'linear-gradient(to right, #f0f7ff, #e6f1ff)',
                    border: '1px solid #cce3ff',
                }}
            >
                <Stack>
                    <Group justify="space-between" align="flex-start">
                        <Group gap="lg" wrap="nowrap">
                            <Avatar size={64} radius="md">
                                <IconBuilding
                                    size={32}
                                    style={{ color: 'primary' }}
                                />
                            </Avatar>
                            <div>
                                <Title order={1} size={32}>
                                    {job?.title}
                                </Title>
                                <Text size="lg" mt={4}>
                                    {job?.organization.name}
                                </Text>
                                <Group gap="sm" mt="md">
                                    <Badge
                                        variant="outline"
                                        leftSection={<IconMapPin size={14} />}
                                    >
                                        {job?.city?.name}, {job?.state?.name},{' '}
                                        {job?.country?.name}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        leftSection={
                                            <IconBriefcase size={14} />
                                        }
                                    >
                                        {job?.type}
                                    </Badge>
                                    {job?.salaryFrom || job?.salaryTo ? (
                                        <Badge
                                            variant="outline"
                                            leftSection={
                                                <IconCurrencyDollar size={14} />
                                            }
                                        >
                                            {job?.salaryFrom &&
                                                new Intl.NumberFormat(
                                                    undefined,
                                                    {
                                                        style: 'currency',
                                                        currency: job?.currency,
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                    },
                                                ).format(job.salaryFrom)}
                                            {job?.salaryFrom &&
                                                job?.salaryTo &&
                                                ' - '}
                                            {job?.salaryTo &&
                                                new Intl.NumberFormat(
                                                    undefined,
                                                    {
                                                        style: 'currency',
                                                        currency: job?.currency,
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                    },
                                                ).format(job.salaryTo)}
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            leftSection={
                                                <IconCurrencyDollar size={14} />
                                            }
                                        >
                                            Salary not specified
                                        </Badge>
                                    )}
                                    {/* <Badge
                    variant="outline"
                    leftSection={<IconCalendar size={14} />}
                  >
                    Posted: {job?.createdAt}
                  </Badge> */}
                                </Group>
                            </div>
                        </Group>
                        <Stack gap="sm">
                            <Box>
                                <Badge
                                    color={
                                        statusStyles[
                                            job?.status as keyof typeof statusStyles
                                        ]?.includes('green')
                                            ? 'green'
                                            : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                              statusStyles[
                                                    job?.status as keyof typeof statusStyles
                                                ]?.includes('blue')
                                              ? 'blue'
                                              : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                statusStyles[
                                                      job?.status as keyof typeof statusStyles
                                                  ]?.includes('red')
                                                ? 'red'
                                                : 'yellow'
                                    }
                                    variant="filled"
                                    size="lg"
                                    radius="xl"
                                >
                                    {statusText[
                                        job?.status as keyof typeof statusText
                                    ] || job?.status}
                                </Badge>
                            </Box>
                        </Stack>
                    </Group>
                </Stack>
            </Paper>

            <Grid>
                {/* Main content - 2/3 width */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap="xl">
                        {/* Job Details Card */}
                        <Card withBorder radius="md">
                            <Card.Section withBorder p="md" bg="gray.0">
                                <Title order={2}>Job Details</Title>
                            </Card.Section>
                            <Tabs defaultValue="description">
                                <Tabs.List grow>
                                    <Tabs.Tab value="description">
                                        Description
                                    </Tabs.Tab>
                                    <Tabs.Tab value="requirements">
                                        Requirements
                                    </Tabs.Tab>
                                    <Tabs.Tab value="responsibilities">
                                        Responsibilities
                                    </Tabs.Tab>
                                    <Tabs.Tab value="benefits">
                                        Benefits
                                    </Tabs.Tab>
                                </Tabs.List>
                                <Box p="xl">
                                    <Tabs.Panel value="description">
                                        <Stack>
                                            <Title order={3} className="mb-4">
                                                Job Description
                                            </Title>
                                            <Paper p="md" withBorder>
                                                {job?.description ? (
                                                    <Box className="prose prose-stone max-w-none px-2.5">
                                                        {parse(job.description)}
                                                    </Box>
                                                ) : (
                                                    <Text className="text-gray-500">
                                                        No description provided
                                                    </Text>
                                                )}
                                            </Paper>
                                        </Stack>

                                        <Stack>
                                            <Title order={3} className="mb-4">
                                                Skills & Expertise
                                            </Title>
                                            <Paper p="md" withBorder>
                                                {(job?.jobSkills ?? []).filter(
                                                    (skill) => skill?.isActive,
                                                ).length > 0 ? (
                                                    <Group gap="xs">
                                                        {(job?.jobSkills ?? [])
                                                            .filter(
                                                                (skill) =>
                                                                    skill?.isActive,
                                                            )
                                                            .map((skill) => (
                                                                <Badge
                                                                    key={
                                                                        skill.id
                                                                    }
                                                                    variant="outline"
                                                                >
                                                                    {
                                                                        skill.skill
                                                                    }
                                                                </Badge>
                                                            ))}
                                                    </Group>
                                                ) : (
                                                    <Text className="text-gray-500">
                                                        No skills provided
                                                    </Text>
                                                )}
                                            </Paper>
                                        </Stack>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="requirements">
                                        <List>
                                            {(job?.jobDescriptions ?? [])
                                                .filter(
                                                    (desc) =>
                                                        desc.type ===
                                                            'REQUIREMENTS' &&
                                                        desc.isActive,
                                                )
                                                .map((req) => (
                                                    <List.Item
                                                        key={req.id}
                                                        icon={
                                                            <IconCircleCheck
                                                                size={18}
                                                                color={
                                                                    theme.colors
                                                                        .teal[5]
                                                                }
                                                            />
                                                        }
                                                    >
                                                        <Text c="gray.7">
                                                            {req.description}
                                                        </Text>
                                                    </List.Item>
                                                ))}
                                        </List>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="responsibilities">
                                        <List>
                                            {(job?.jobDescriptions ?? [])
                                                .filter(
                                                    (desc) =>
                                                        desc.type ===
                                                            'RESPONSIBILITY' &&
                                                        desc.isActive,
                                                )
                                                .map((resp) => (
                                                    <List.Item
                                                        key={resp.id}
                                                        icon={
                                                            <IconCircleCheck
                                                                size={18}
                                                                color={
                                                                    theme.colors
                                                                        .teal[5]
                                                                }
                                                            />
                                                        }
                                                    >
                                                        <Text c="gray.7">
                                                            {resp.description}
                                                        </Text>
                                                    </List.Item>
                                                ))}
                                        </List>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="benefits">
                                        <List>
                                            {(job?.jobDescriptions ?? [])
                                                .filter(
                                                    (desc) =>
                                                        desc.type ===
                                                            'BENEFITS' &&
                                                        desc.isActive,
                                                )
                                                .map((benefit) => (
                                                    <List.Item
                                                        key={benefit.id}
                                                        icon={
                                                            <IconCircleCheck
                                                                size={18}
                                                                color={
                                                                    theme.colors
                                                                        .teal[5]
                                                                }
                                                            />
                                                        }
                                                    >
                                                        <Text c="gray.7">
                                                            {
                                                                benefit.description
                                                            }
                                                        </Text>
                                                    </List.Item>
                                                ))}
                                        </List>
                                    </Tabs.Panel>
                                </Box>
                            </Tabs>
                            <Card.Section withBorder p="md" bg="gray.0">
                                <Group justify="space-between">
                                    <Group gap="xs">
                                        <IconClock size={16} />
                                        <Text size="sm" c="gray.6">
                                            Expires:{' '}
                                            {job?.deadline
                                                ? new Date(
                                                      job.deadline,
                                                  ).toLocaleDateString(
                                                      'en-US',
                                                      {
                                                          year: 'numeric',
                                                          month: 'long',
                                                          day: 'numeric',
                                                      },
                                                  )
                                                : 'No deadline'}
                                        </Text>
                                    </Group>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        leftSection={<IconShare size={14} />}
                                    >
                                        Share
                                    </Button>
                                </Group>
                            </Card.Section>
                        </Card>

                        {/* Applicant Pipeline Card */}
                        <Card withBorder radius="md" hidden>
                            <Card.Section withBorder p="md" bg="gray.0">
                                <Group>
                                    <IconUsers
                                        size={20}
                                        color={theme.colors.gray[6]}
                                    />
                                    <Title order={2}>Applicant Pipeline</Title>
                                </Group>
                                <Text c="gray.6">
                                    Track your applicants through the hiring
                                    process
                                </Text>
                            </Card.Section>
                            <Box p="xl">
                                <Stack gap="xl">
                                    {/* Pipeline Overview */}
                                    <Paper
                                        withBorder
                                        p="md"
                                        radius="md"
                                        bg="gray.0"
                                    >
                                        <Group justify="space-between">
                                            <Group>
                                                <Avatar radius="xl" size={48}>
                                                    <IconUsers size={24} />
                                                </Avatar>
                                                <div>
                                                    <Text size="sm" c="gray.6">
                                                        Total Applicants
                                                    </Text>
                                                    <Title order={3}>
                                                        {
                                                            jobData.stats
                                                                .applicants
                                                        }
                                                    </Title>
                                                </div>
                                            </Group>
                                            <Group>
                                                <Button
                                                    variant="outline"
                                                    leftSection={
                                                        <IconDownload
                                                            size={14}
                                                        />
                                                    }
                                                >
                                                    Export
                                                </Button>
                                                <Button
                                                    leftSection={
                                                        <IconEye size={14} />
                                                    }
                                                >
                                                    View All
                                                </Button>
                                            </Group>
                                        </Group>
                                    </Paper>

                                    {/* Pipeline Stages */}
                                    <SimpleGrid cols={{ base: 1, md: 4 }}>
                                        <Paper
                                            withBorder
                                            p="md"
                                            radius="md"
                                            bg="gray.0"
                                        >
                                            <Group
                                                justify="space-between"
                                                mb="sm"
                                            >
                                                <Text
                                                    size="sm"
                                                    c="gray.6"
                                                    fw={500}
                                                >
                                                    Applied
                                                </Text>
                                                <Badge
                                                    variant="filled"
                                                    color="gray"
                                                >
                                                    {jobData.stats.applicants}
                                                </Badge>
                                            </Group>
                                            <Progress value={100} size="sm" />
                                        </Paper>
                                        <Paper
                                            withBorder
                                            p="md"
                                            radius="md"
                                            bg="gray.0"
                                        >
                                            <Group
                                                justify="space-between"
                                                mb="sm"
                                            >
                                                <Text
                                                    size="sm"
                                                    c="gray.6"
                                                    fw={500}
                                                >
                                                    Shortlisted
                                                </Text>
                                                <Badge
                                                    variant="filled"
                                                    color="gray"
                                                >
                                                    {jobData.stats.shortlisted}
                                                </Badge>
                                            </Group>
                                            <Progress
                                                value={
                                                    (jobData.stats.shortlisted /
                                                        jobData.stats
                                                            .applicants) *
                                                    100
                                                }
                                                size="sm"
                                            />
                                        </Paper>
                                        <Paper
                                            withBorder
                                            p="md"
                                            radius="md"
                                            bg="gray.0"
                                        >
                                            <Group
                                                justify="space-between"
                                                mb="sm"
                                            >
                                                <Text
                                                    size="sm"
                                                    c="gray.6"
                                                    fw={500}
                                                >
                                                    Interviewed
                                                </Text>
                                                <Badge
                                                    variant="filled"
                                                    color="gray"
                                                >
                                                    {jobData.stats.interviewed}
                                                </Badge>
                                            </Group>
                                            <Progress
                                                value={
                                                    (jobData.stats.interviewed /
                                                        jobData.stats
                                                            .applicants) *
                                                    100
                                                }
                                                size="sm"
                                            />
                                        </Paper>
                                        <Paper
                                            withBorder
                                            p="md"
                                            radius="md"
                                            bg="gray.0"
                                        >
                                            <Group
                                                justify="space-between"
                                                mb="sm"
                                            >
                                                <Text
                                                    size="sm"
                                                    c="gray.6"
                                                    fw={500}
                                                >
                                                    Hired
                                                </Text>
                                                <Badge
                                                    variant="filled"
                                                    color="gray"
                                                >
                                                    {jobData.stats.hired}
                                                </Badge>
                                            </Group>
                                            <Progress
                                                value={
                                                    (jobData.stats.hired /
                                                        jobData.stats
                                                            .applicants) *
                                                    100
                                                }
                                                size="sm"
                                            />
                                        </Paper>
                                    </SimpleGrid>

                                    {/* Applicant Status */}
                                    <SimpleGrid cols={{ base: 1, md: 3 }}>
                                        <Paper
                                            withBorder
                                            p="md"
                                            radius="md"
                                            bg="teal.0"
                                            style={{
                                                borderColor:
                                                    theme.colors.teal[2],
                                            }}
                                        >
                                            <Group wrap="nowrap">
                                                <IconCircleCheck
                                                    size={40}
                                                    color={theme.colors.teal[5]}
                                                />
                                                <div>
                                                    <Text
                                                        size="sm"
                                                        c="teal.6"
                                                        fw={500}
                                                    >
                                                        Shortlisted
                                                    </Text>
                                                    <Title order={3} c="teal.7">
                                                        {
                                                            jobData.stats
                                                                .shortlisted
                                                        }
                                                    </Title>
                                                    <Text size="xs" c="teal.6">
                                                        {(
                                                            (jobData.stats
                                                                .shortlisted /
                                                                jobData.stats
                                                                    .applicants) *
                                                            100
                                                        ).toFixed(1)}
                                                        % of applicants
                                                    </Text>
                                                </div>
                                            </Group>
                                        </Paper>
                                        <Paper
                                            withBorder
                                            p="md"
                                            radius="md"
                                            bg="yellow.0"
                                            style={{
                                                borderColor:
                                                    theme.colors.yellow[2],
                                            }}
                                        >
                                            <Group wrap="nowrap">
                                                <IconAlertCircle
                                                    size={40}
                                                    color={
                                                        theme.colors.yellow[5]
                                                    }
                                                />
                                                <div>
                                                    <Text
                                                        size="sm"
                                                        c="yellow.6"
                                                        fw={500}
                                                    >
                                                        In Progress
                                                    </Text>
                                                    <Title
                                                        order={3}
                                                        c="yellow.7"
                                                    >
                                                        {
                                                            jobData.stats
                                                                .interviewed
                                                        }
                                                    </Title>
                                                    <Text
                                                        size="xs"
                                                        c="yellow.6"
                                                    >
                                                        {(
                                                            (jobData.stats
                                                                .interviewed /
                                                                jobData.stats
                                                                    .applicants) *
                                                            100
                                                        ).toFixed(1)}
                                                        % of applicants
                                                    </Text>
                                                </div>
                                            </Group>
                                        </Paper>
                                        <Paper
                                            withBorder
                                            p="md"
                                            radius="md"
                                            bg="red.0"
                                            style={{
                                                borderColor:
                                                    theme.colors.red[2],
                                            }}
                                        >
                                            <Group wrap="nowrap">
                                                <IconX
                                                    size={40}
                                                    color={theme.colors.red[5]}
                                                />
                                                <div>
                                                    <Text
                                                        size="sm"
                                                        c="red.6"
                                                        fw={500}
                                                    >
                                                        Rejected
                                                    </Text>
                                                    <Title order={3} c="red.7">
                                                        {jobData.stats.rejected}
                                                    </Title>
                                                    <Text size="xs" c="red.6">
                                                        {(
                                                            (jobData.stats
                                                                .rejected /
                                                                jobData.stats
                                                                    .applicants) *
                                                            100
                                                        ).toFixed(1)}
                                                        % of applicants
                                                    </Text>
                                                </div>
                                            </Group>
                                        </Paper>
                                    </SimpleGrid>
                                </Stack>
                            </Box>
                        </Card>

                        {/* Recent Applicants Card */}
                        <Card withBorder radius="md" hidden>
                            <Card.Section withBorder p="md" bg="gray.0">
                                <Group justify="space-between">
                                    <Group>
                                        <IconUsers
                                            size={20}
                                            color={theme.colors.gray[6]}
                                        />
                                        <Title order={2}>
                                            Recent Applicants
                                        </Title>
                                    </Group>
                                    <Button variant="outline">View All</Button>
                                </Group>
                                <Text c="gray.6">
                                    Latest candidates who applied for this
                                    position
                                </Text>
                            </Card.Section>
                            <Card.Section>
                                {[1, 2, 3].map((i) => (
                                    <Box
                                        key={i}
                                        p="md"
                                        style={{
                                            '&:hover': {
                                                backgroundColor:
                                                    theme.colors.gray[0],
                                            },
                                        }}
                                    >
                                        <Group justify="space-between">
                                            <Group>
                                                <Avatar>
                                                    {String.fromCharCode(
                                                        64 + i,
                                                    )}
                                                </Avatar>
                                                <div>
                                                    <Text fw={500}>
                                                        Candidate {i}
                                                    </Text>
                                                    <Text size="sm" c="dimmed">
                                                        Applied 2 day
                                                        {i > 1 ? 's' : ''} ago
                                                    </Text>
                                                </div>
                                            </Group>
                                            <Group gap={4}>
                                                <ActionIcon>
                                                    <IconMail size={16} />
                                                </ActionIcon>
                                                <ActionIcon>
                                                    <IconDownload size={16} />
                                                </ActionIcon>
                                                <ActionIcon>
                                                    <IconCircleCheck
                                                        size={16}
                                                    />
                                                </ActionIcon>
                                            </Group>
                                        </Group>
                                    </Box>
                                ))}
                            </Card.Section>
                        </Card>
                    </Stack>
                </Grid.Col>

                {/* Sidebar - 1/3 width */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack gap="xl">
                        {/* Job Status Card */}
                        <Card withBorder radius="md">
                            <Card.Section withBorder p="md" bg="primary.9">
                                <Title order={2} c="white">
                                    Job Status
                                </Title>
                                <Text c="gray.4">
                                    This job posting is currently active
                                </Text>
                            </Card.Section>
                            <Card.Section p="xl" bg="gray.0">
                                <Stack gap="lg">
                                    <Group justify="space-between">
                                        <Group gap="xs">
                                            <IconCalendar
                                                size={16}
                                                color={theme.colors.gray[6]}
                                            />
                                            <Text size="sm">
                                                Posted {jobData.postedDate}
                                            </Text>
                                        </Group>
                                        <Badge variant="filled" color="gray">
                                            {job?.deadline
                                                ? `${Math.ceil((new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left`
                                                : '-'}
                                        </Badge>
                                    </Group>
                                    <div>
                                        <Group justify="space-between" mb="xs">
                                            <Text size="sm" fw={500}>
                                                Time Remaining
                                            </Text>
                                            <Text size="sm" c="gray.6" fw={500}>
                                                {job?.deadline
                                                    ? `${Math.round(((new Date(job.deadline).getTime() - Date.now()) / (new Date(job.deadline).getTime() - Date.now())) * 100)}%`
                                                    : '-'}
                                            </Text>
                                        </Group>
                                        <Progress
                                            value={
                                                job?.deadline
                                                    ? Math.round(
                                                          ((new Date(
                                                              job.deadline,
                                                          ).getTime() -
                                                              Date.now()) /
                                                              (new Date(
                                                                  job.deadline,
                                                              ).getTime() -
                                                                  Date.now())) *
                                                              100,
                                                      )
                                                    : 0
                                            }
                                            size="sm"
                                            mb="xs"
                                        />
                                    </div>
                                    <Stack gap="xs">
                                        <Button
                                            variant="outline"
                                            leftSection={<IconBell size={16} />}
                                        >
                                            Set Alerts
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Card.Section>
                        </Card>

                        {/* Job Performance Card */}
                        <Card withBorder radius="md">
                            <Card.Section withBorder p="md" bg="gray.0">
                                <Group>
                                    <IconChartBar
                                        size={20}
                                        color={theme.colors.gray[6]}
                                    />
                                    <Title order={2}>Job Performance</Title>
                                </Group>
                            </Card.Section>
                            <Card.Section p="xl">
                                <Stack gap="lg">
                                    <Paper withBorder p="md" radius="md">
                                        <Group justify="space-between">
                                            <Group gap="xs">
                                                <IconEye
                                                    size={20}
                                                    color={theme.colors.gray[6]}
                                                />
                                                <Text size="sm" fw={500}>
                                                    Total Views
                                                </Text>
                                            </Group>
                                            <Title order={3}>
                                                {jobData.stats.views.toLocaleString()}
                                            </Title>
                                        </Group>
                                    </Paper>
                                    <Paper withBorder p="md" radius="md">
                                        <Group justify="space-between">
                                            <Group gap="xs">
                                                <IconUsers
                                                    size={20}
                                                    color={theme.colors.gray[6]}
                                                />
                                                <Text size="sm" fw={500}>
                                                    Applications
                                                </Text>
                                            </Group>
                                            <Title order={3}>
                                                {jobData.stats.applicants}
                                            </Title>
                                        </Group>
                                    </Paper>
                                    <Paper withBorder p="md" radius="md">
                                        <Group justify="space-between">
                                            <Group gap="xs">
                                                <IconCalendar
                                                    size={20}
                                                    color={theme.colors.gray[6]}
                                                />
                                                <Text size="sm" fw={500}>
                                                    Days Remaining
                                                </Text>
                                            </Group>
                                            <Title order={3}>
                                                {jobData.stats.daysRemaining}
                                            </Title>
                                        </Group>
                                    </Paper>
                                    <Divider />
                                    <div>
                                        <Group justify="space-between" mb="xs">
                                            <Text size="sm" fw={500}>
                                                Application Rate
                                            </Text>
                                            <Text size="sm" c="gray.6" fw={500}>
                                                {(
                                                    (jobData.stats.applicants /
                                                        jobData.stats.views) *
                                                    100
                                                ).toFixed(1)}
                                                %
                                            </Text>
                                        </Group>
                                        <Progress
                                            value={
                                                (jobData.stats.applicants /
                                                    jobData.stats.views) *
                                                100
                                            }
                                            size="sm"
                                            mb="xs"
                                        />
                                        <Group justify="space-between">
                                            <Text size="xs" c="gray.6">
                                                {jobData.stats.applicants}{' '}
                                                applications
                                            </Text>
                                            <Text size="xs" c="gray.6">
                                                {jobData.stats.views.toLocaleString()}{' '}
                                                views
                                            </Text>
                                        </Group>
                                    </div>
                                </Stack>
                            </Card.Section>
                        </Card>

                        {/* Actions Card */}
                        <Card withBorder radius="md" hidden>
                            <Card.Section withBorder p="md" bg="gray.0">
                                <Group>
                                    <IconExternalLink
                                        size={20}
                                        color={theme.colors.gray[6]}
                                    />
                                    <Title order={2}>Admin Actions</Title>
                                </Group>
                            </Card.Section>
                            <Card.Section p="xl">
                                <Stack gap="xs">
                                    <Button
                                        variant="light"
                                        leftSection={<IconEdit size={16} />}
                                        fullWidth
                                        justify="flex-start"
                                    >
                                        Edit Job Posting
                                    </Button>
                                    <Button
                                        variant="light"
                                        leftSection={<IconShare size={16} />}
                                        fullWidth
                                        justify="flex-start"
                                    >
                                        Share Job
                                    </Button>
                                    <Button
                                        variant="light"
                                        leftSection={<IconDownload size={16} />}
                                        fullWidth
                                        justify="flex-start"
                                    >
                                        Export Applicants
                                    </Button>
                                    <Button
                                        variant="light"
                                        leftSection={<IconArchive size={16} />}
                                        fullWidth
                                        justify="flex-start"
                                    >
                                        Close Job
                                    </Button>
                                    <Button
                                        variant="light"
                                        leftSection={<IconTrash size={16} />}
                                        fullWidth
                                        color="red"
                                        justify="flex-start"
                                    >
                                        Delete Job
                                    </Button>
                                </Stack>
                            </Card.Section>
                        </Card>

                        {/* Job Timeline Card */}
                        <Card withBorder radius="md" hidden>
                            <Card.Section withBorder p="md" bg="gray.0">
                                <Group>
                                    <IconClock
                                        size={20}
                                        color={theme.colors.gray[6]}
                                    />
                                    <Title order={2}>Job Timeline</Title>
                                </Group>
                            </Card.Section>
                            <Card.Section p="xl">
                                <Timeline
                                    active={2}
                                    bulletSize={24}
                                    lineWidth={2}
                                >
                                    <Timeline.Item
                                        bullet={<IconCircleCheck size={12} />}
                                        title="Posted"
                                        color="teal"
                                    >
                                        <Text size="sm" c="dimmed">
                                            {jobData.postedDate}
                                        </Text>
                                    </Timeline.Item>

                                    <Timeline.Item
                                        bullet={<IconCircleCheck size={12} />}
                                        title="First Application"
                                        color="yellow"
                                    >
                                        <Text size="sm" c="dimmed">
                                            March 16, 2025
                                        </Text>
                                    </Timeline.Item>

                                    <Timeline.Item
                                        bullet={<IconCircleCheck size={12} />}
                                        title="First Interview Scheduled"
                                        color="blue"
                                    >
                                        <Text size="sm" c="dimmed">
                                            March 22, 2025
                                        </Text>
                                    </Timeline.Item>

                                    <Timeline.Item
                                        bullet={<IconCircleCheck size={12} />}
                                        title="Expires"
                                        color="gray"
                                    >
                                        <Text size="sm" c="dimmed">
                                            {jobData.expiryDate}
                                        </Text>
                                    </Timeline.Item>
                                </Timeline>
                            </Card.Section>
                        </Card>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Container>
    );
}

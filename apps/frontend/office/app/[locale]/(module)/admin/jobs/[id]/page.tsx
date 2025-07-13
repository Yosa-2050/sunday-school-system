'use client';

import { useRouter } from '@/i18n/routing';
import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Container,
    Divider,
    Flex,
    Grid,
    Group,
    List,
    LoadingOverlay,
    Modal,
    Paper,
    Stack,
    Text,
    Title,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
    IconArrowLeft,
    IconBuilding,
    IconCash,
    IconCheck,
    IconMapPin,
    IconPhone,
    IconUser,
    IconX,
} from '@tabler/icons-react';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { approveJob } from 'app/[locale]/_api/admin/approve-job';
import { fetchJobsAdminById } from 'app/[locale]/_api/admin/fetch-jobs-by-id';
import type { JobDetailsViewProps } from 'app/[locale]/_api/admin/fetch-jobs-by-id';
import parse from 'html-react-parser';
import { useParams } from 'next/navigation';
import DeclineModal from '../_components/DeclineModal';

const JobDetails = () => {
    const params = useParams();
    const router = useRouter();
    const queryClient = new QueryClient();
    const jobId = params.id as string;
    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme();

    const { data: job, isLoading } = useQuery<JobDetailsViewProps>({
        queryKey: ['job', jobId],
        queryFn: async () => await fetchJobsAdminById(jobId),
    });

    const { mutate: approveJobMutate, isPending: isApprovingJob } = useMutation(
        {
            // mutationFn: async () => await approveJob(jobId),
            mutationFn: async () => {
                if (!job?.programId) {
                    throw new Error('Program ID is not available.');
                }
                return await approveJob(job.programId);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['job', job?.programId],
                });
                // router.push('/admin/jobs');
                window.location.replace('/admin/jobs');
                notifications.show({
                    title: 'Job Approved',
                    message: 'The job has been successfully approved',
                    color: 'green',
                });
            },
            onError: (error) => {
                notifications.show({
                    title: 'Error Approving Job',
                    message: error.message,
                    color: 'red',
                });
            },
        },
    );

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (!job) {
        return <Text>Job not found</Text>;
    }

    return (
        <Container fluid size="xl" className="py-4">
            {/* Header Section */}
            <div className="mb-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <Flex>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="lg"
                            onClick={() => router.back()}
                            aria-label="Back to previous page"
                            className="mr-2"
                        >
                            <IconArrowLeft size={24} />
                        </ActionIcon>
                        <Text className="text-2xl font-semibold mb-2">
                            {job.title}
                        </Text>
                    </Flex>
                    <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center">
                            <IconBuilding size={18} className="mr-2" />
                            <Text>{job.organization.name}</Text>
                        </div>
                        <div className="flex items-center">
                            <IconMapPin size={18} className="mr-2" />
                            <Text>{job.country.name}</Text>
                        </div>
                        <Badge variant="light">
                            {job.type.replace('_', ' ')}
                        </Badge>
                    </div>
                </div>
            </div>

            <Grid gutter="md">
                {/* Employer Information */}
                <Grid.Col span={{ base: 12, md: 3 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack align="center" gap="sm">
                            <Avatar
                                size={100}
                                radius="50%"
                                src="/avatar.png"
                                alt="Employer"
                                className="border-2 border-white shadow-md"
                            />
                            <Text className="text-xl font-semibold text-center">
                                {job.postedBy.employee.profile.firstName}{' '}
                                {job.postedBy.employee.profile.lastName}
                            </Text>
                            <Badge variant="light">
                                {job.organization.name}
                            </Badge>

                            <Divider my="sm" w="100%" />

                            <Stack gap="xs" w="100%">
                                <Group gap="sm">
                                    <IconUser
                                        size={18}
                                        className="text-gray-500"
                                    />
                                    <Text size="sm">Administrator</Text>
                                </Group>
                                <Group gap="sm">
                                    <IconPhone
                                        size={18}
                                        className="text-gray-500"
                                    />
                                    <Text size="sm">
                                        {job.postedBy.employee.profile
                                            .phoneNumber || 'N/A'}
                                    </Text>
                                </Group>
                            </Stack>
                        </Stack>
                    </Card>
                </Grid.Col>

                {/* Job Details */}
                <Grid.Col span={{ base: 12, md: 9 }}>
                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <Stack>
                            <Title order={2} className="mb-6">
                                Job Details
                            </Title>

                            <Grid gutter="xl">
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Stack gap="sm">
                                        <Group gap="sm">
                                            <IconUser
                                                size={20}
                                                className="text-gray-500"
                                            />
                                            <Text className="font-medium">
                                                Job Title:
                                            </Text>
                                            <Text>{job.title}</Text>
                                        </Group>
                                        <Group gap="sm">
                                            <IconBuilding
                                                size={20}
                                                className="text-gray-500"
                                            />
                                            <Text className="font-medium">
                                                Employment Type:
                                            </Text>
                                            <Badge color="teal" variant="light">
                                                {job.type.replace('_', ' ')}
                                            </Badge>
                                        </Group>
                                        {job.workPlace && (
                                            <Group gap="sm">
                                                <IconMapPin
                                                    size={20}
                                                    className="text-gray-500"
                                                />
                                                <Text className="font-medium">
                                                    Workplace Type:
                                                </Text>
                                                <Badge
                                                    color="blue"
                                                    variant="light"
                                                >
                                                    {job.workPlace.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </Badge>
                                            </Group>
                                        )}
                                    </Stack>
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Stack gap="sm">
                                        <Group gap="sm">
                                            <IconCash
                                                size={20}
                                                className="text-gray-500"
                                            />
                                            <Text className="font-medium">
                                                Salary:
                                            </Text>
                                            <Text>
                                                {(() => {
                                                    if (
                                                        job?.salaryFrom &&
                                                        job?.salaryTo
                                                    ) {
                                                        return `${job.salaryFrom.toLocaleString()} - ${job.salaryTo.toLocaleString()} ${job.currency}`;
                                                    }
                                                    if (job?.salaryFrom) {
                                                        return `${job.salaryFrom.toLocaleString()} ${job.currency}`;
                                                    }
                                                    return 'N/A';
                                                })()}
                                            </Text>
                                        </Group>
                                        <Group gap="sm">
                                            <IconMapPin
                                                size={20}
                                                className="text-gray-500"
                                            />
                                            <Text className="font-medium">
                                                Location:
                                            </Text>
                                            <Text>
                                                {job.city?.name &&
                                                    `${job.city.name}, `}
                                                {job.state?.name &&
                                                    `${job.state.name}, `}
                                                {job.country.name}
                                            </Text>
                                        </Group>
                                        <Group gap="sm">
                                            <IconUser
                                                size={20}
                                                className="text-gray-500"
                                            />
                                            <Text className="font-medium">
                                                Experience:
                                            </Text>
                                            <Text>
                                                {job.experianceLevel.replace(
                                                    '_',
                                                    ' ',
                                                )}{' '}
                                                ({job.experiance} years)
                                            </Text>
                                        </Group>
                                        <Group gap="sm">
                                            <IconBuilding
                                                size={20}
                                                className="text-gray-500"
                                            />
                                            <Text className="font-medium">
                                                Education:
                                            </Text>
                                            <Text>
                                                {job.educationalRequirment.replace(
                                                    '_',
                                                    ' ',
                                                )}
                                            </Text>
                                        </Group>
                                        <Group gap="sm">
                                            <IconCash
                                                size={20}
                                                className="text-gray-500"
                                            />
                                            <Text className="font-medium">
                                                Deadline:
                                            </Text>
                                            <Text>
                                                {new Date(
                                                    job.deadline,
                                                ).toLocaleDateString()}
                                            </Text>
                                        </Group>
                                    </Stack>
                                </Grid.Col>
                            </Grid>

                            <Divider my="lg" />

                            <Stack>
                                <Title order={3} className="mb-4">
                                    Job Description
                                </Title>
                                <Paper p="md" withBorder>
                                    {job.description ? (
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
                                    Requirements
                                </Title>
                                <Paper p="md" withBorder>
                                    {job.jobDescriptions?.filter(
                                        (desc) =>
                                            desc.type === 'REQUIREMENTS' &&
                                            desc.isActive,
                                    ).length > 0 ? (
                                        <List>
                                            {job.jobDescriptions
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
                                                            <IconCheck
                                                                size={18}
                                                                color={
                                                                    theme.colors
                                                                        .teal[5]
                                                                }
                                                            />
                                                        }
                                                    >
                                                        <Text>
                                                            {req.description}
                                                        </Text>
                                                    </List.Item>
                                                ))}
                                        </List>
                                    ) : (
                                        <Text className="text-gray-500">
                                            No requirements provided
                                        </Text>
                                    )}
                                </Paper>
                            </Stack>

                            <Stack>
                                <Title order={3} className="mb-4">
                                    Responsibilities
                                </Title>
                                <Paper p="md" withBorder>
                                    {job.jobDescriptions?.filter(
                                        (desc) =>
                                            desc.type === 'RESPONSIBILITY' &&
                                            desc.isActive,
                                    ).length > 0 ? (
                                        <List>
                                            {job.jobDescriptions
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
                                                            <IconCheck
                                                                size={18}
                                                                color={
                                                                    theme.colors
                                                                        .teal[5]
                                                                }
                                                            />
                                                        }
                                                    >
                                                        <Text>
                                                            {resp.description}
                                                        </Text>
                                                    </List.Item>
                                                ))}
                                        </List>
                                    ) : (
                                        <Text className="text-gray-500">
                                            No responsibilities provided
                                        </Text>
                                    )}
                                </Paper>
                            </Stack>

                            <Stack>
                                <Title order={3} className="mb-4">
                                    Benefits
                                </Title>
                                <Paper p="md" withBorder>
                                    {job.jobDescriptions?.filter(
                                        (desc) =>
                                            desc.type === 'BENEFITS' &&
                                            desc.isActive,
                                    ).length > 0 ? (
                                        <List>
                                            {job.jobDescriptions
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
                                                            <IconCheck
                                                                size={18}
                                                                color={
                                                                    theme.colors
                                                                        .teal[5]
                                                                }
                                                            />
                                                        }
                                                    >
                                                        <Text>
                                                            {
                                                                benefit.description
                                                            }
                                                        </Text>
                                                    </List.Item>
                                                ))}
                                        </List>
                                    ) : (
                                        <Text className="text-gray-500">
                                            No benefits provided
                                        </Text>
                                    )}
                                </Paper>
                            </Stack>

                            {job.status === 'WAITINGAPPROVAL' && (
                                <Flex justify="flex-end" gap="md" mt="xl">
                                    <Button
                                        color="red"
                                        size="md"
                                        onClick={open}
                                        leftSection={<IconX size={18} />}
                                        className="hover:bg-red-600"
                                        disabled={isApprovingJob}
                                    >
                                        Decline
                                    </Button>
                                    <Button
                                        color="green"
                                        size="md"
                                        onClick={() => approveJobMutate()}
                                        loading={isApprovingJob}
                                        leftSection={<IconCheck size={18} />}
                                        className="hover:bg-green-600"
                                    >
                                        Approve
                                    </Button>
                                </Flex>
                            )}
                        </Stack>
                    </Paper>
                </Grid.Col>
            </Grid>

            <Modal
                opened={opened}
                onClose={close}
                title="Decline Reason"
                centered
                size="md"
            >
                <DeclineModal close={close} programId={job.programId} />
            </Modal>
        </Container>
    );
};

export default JobDetails;

'use client';

import { useRouter } from '@/i18n/routing';
import {
    ActionIcon,
    Avatar,
    Badge,
    Button,
    Card,
    Container,
    Divider,
    Flex,
    Grid,
    Group,
    LoadingOverlay,
    Modal,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
    IconArrowLeft,
    IconBuilding,
    IconCalendar,
    IconCash,
    IconMail,
    IconMapPin,
    IconPhone,
    IconUser,
} from '@tabler/icons-react';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { approveJob } from 'app/[locale]/_api/admin/approve-job';
import { fetchJobsAdminById } from 'app/[locale]/_api/admin/fetch-jobs-by-id';
import { useParams } from 'next/navigation';
import DeclineModal from '../_components/DeclineModal';

const JobDetails = () => {
    const params = useParams();
    const router = useRouter();
    const queryClient = new QueryClient();
    const jobId = params.id as string;
    const [opened, { open, close }] = useDisclosure(false);

    const { data: job, isLoading } = useQuery({
        queryKey: ['job', jobId],
        queryFn: async () => await fetchJobsAdminById(jobId),
    });

    const { mutate: approveJobMutate, isPending: isApprovingJob } = useMutation(
        {
            mutationFn: async () => await approveJob(jobId),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['job', jobId] });
                router.push('/admin/jobs');
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
                                    <Text size="sm">+251 9 123 456 78</Text>
                                </Group>
                                <Group gap="sm">
                                    <IconMail
                                        size={18}
                                        className="text-gray-500"
                                    />
                                    <Text size="sm">employer@mail.com</Text>
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
                                                Salary Range:
                                            </Text>
                                            <Text>
                                                {job.salaryFrom.toLocaleString()}{' '}
                                                -{' '}
                                                {job.salaryTo.toLocaleString()}{' '}
                                                ETB
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
                                            <Text>{job.country.name}</Text>
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
                                        <div
                                            className="prose max-w-none px-2.5"
                                            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                                            dangerouslySetInnerHTML={{
                                                __html: job.description,
                                            }}
                                        />
                                    ) : (
                                        <Text className="text-gray-500">
                                            No description provided
                                        </Text>
                                    )}
                                </Paper>
                            </Stack>

                            {job.status === 'WAITINGAPPROVAL' && (
                                <Flex justify="flex-end" gap="md" mt="xl">
                                    <Button
                                        color="red"
                                        size="md"
                                        loading={isApprovingJob}
                                        onClick={open}
                                        leftSection={<IconCalendar size={18} />}
                                        className="hover:bg-red-600"
                                    >
                                        Decline
                                    </Button>
                                    <Button
                                        color="green"
                                        size="md"
                                        onClick={() => approveJobMutate()}
                                        loading={isApprovingJob}
                                        leftSection={<IconCalendar size={18} />}
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
                <DeclineModal close={close} />
            </Modal>
        </Container>
    );
};

export default JobDetails;

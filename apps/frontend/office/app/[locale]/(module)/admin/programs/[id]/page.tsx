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
    IconCalendar,
    IconCheck,
    IconClock,
    IconMapPin,
    IconPhone,
    IconSchool,
    IconUser,
    IconUsers,
    IconX,
} from '@tabler/icons-react';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { approveJob } from 'app/[locale]/_api/admin/approve-job';
import {
    type MentorshipProgram,
    fetchMentorshipProgramsById,
} from 'app/[locale]/_api/admin/fetch-mentorship';
import parse from 'html-react-parser';
import { useParams } from 'next/navigation';
import DeclineModal from '../_components/Decline';

const MentorshipDetails = () => {
    const params = useParams();
    const router = useRouter();
    const queryClient = new QueryClient();
    const programId = params.id as string;
    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme();

    const { data: program, isLoading } = useQuery<MentorshipProgram>({
        queryKey: ['mentorship', programId],
        queryFn: async () => await fetchMentorshipProgramsById(programId),
    });

    const approveProgramMutate = useMutation({
        // mutationFn: async () => await approveJob(jobId),
        mutationFn: async () => {
            if (!program?.program.id) {
                throw new Error('Program ID is not available.');
            }
            return await approveJob(program?.program.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['job', program?.program.id],
            });
            router.push('/admin/programs');
            notifications.show({
                title: 'Mentorship Program Approved',
                message:
                    'The Mentorship program has been successfully approved',
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
    });

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (!program) {
        return <Text>Mentorship program not found</Text>;
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
                            {program.program.title}
                        </Text>
                    </Flex>
                    <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center">
                            <IconUsers size={18} className="mr-2" />
                            <Text>{program.mentorshipType}</Text>
                        </div>
                        <div className="flex items-center">
                            <IconMapPin size={18} className="mr-2" />
                            <Text>{program.program.country?.name}</Text>
                        </div>
                        <Badge variant="light">{program.audience}</Badge>
                    </div>
                </div>
            </div>

            <Grid gutter="md">
                {/* Mentor Information */}
                <Grid.Col span={{ base: 12, md: 3 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack align="center" gap="sm">
                            <Avatar
                                size={100}
                                radius="50%"
                                src="/avatar.png"
                                alt="Mentor"
                                className="border-2 border-white shadow-md"
                            />
                            <Text className="text-xl font-semibold text-center">
                                {program.mentor?.profile?.firstName}{' '}
                                {program.mentor?.profile?.lastName}
                            </Text>
                            <Badge variant="light" color="teal">
                                Mentor
                            </Badge>

                            <Divider my="sm" w="100%" />

                            <Stack gap="xs" w="100%">
                                <Group gap="sm">
                                    <IconUser
                                        size={18}
                                        className="text-gray-500"
                                    />
                                    <Text size="sm">
                                        Status: {program?.mentor?.status}
                                    </Text>
                                </Group>
                                {program?.mentor?.profile?.phoneNumber && (
                                    <Group gap="sm">
                                        <IconPhone
                                            size={18}
                                            className="text-gray-500"
                                        />
                                        <Text size="sm">
                                            {program.mentor.profile.phoneNumber}
                                        </Text>
                                    </Group>
                                )}
                            </Stack>
                        </Stack>
                    </Card>
                </Grid.Col>

                {/* Program Details */}
                <Grid.Col span={{ base: 12, md: 9 }}>
                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <Stack>
                            <Title order={2} className="mb-6">
                                Mentorship Program Details
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
                                                Program Title:
                                            </Text>
                                            <Text>{program.program.title}</Text>
                                        </Group>
                                        <Group gap="sm">
                                            <IconUsers
                                                size={20}
                                                className="text-gray-500"
                                            />
                                            <Text className="font-medium">
                                                Mentorship Type:
                                            </Text>
                                            <Badge color="blue" variant="light">
                                                {program.mentorshipType}
                                            </Badge>
                                        </Group>
                                        <Group gap="sm">
                                            <IconClock
                                                size={20}
                                                className="text-gray-500"
                                            />
                                            <Text className="font-medium">
                                                Commitment:
                                            </Text>
                                            <Badge
                                                color="violet"
                                                variant="light"
                                            >
                                                {program.commitment}
                                            </Badge>
                                        </Group>
                                        <Group gap="sm">
                                            <IconCalendar
                                                size={20}
                                                className="text-gray-500"
                                            />
                                            <Text className="font-medium">
                                                Duration:
                                            </Text>
                                            <Text>
                                                {program.duration} weeks
                                            </Text>
                                        </Group>
                                    </Stack>
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Stack gap="sm">
                                        <Group gap="sm">
                                            <IconSchool
                                                size={20}
                                                className="text-gray-500"
                                            />
                                            <Text className="font-medium">
                                                Audience:
                                            </Text>
                                            <Badge
                                                color="orange"
                                                variant="light"
                                            >
                                                {program.audience}
                                            </Badge>
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
                                                {program.program.city?.name &&
                                                    `${program.program.city.name}, `}
                                                {program.program.state?.name &&
                                                    `${program.program.state.name}, `}
                                                {program.program?.country?.name}
                                            </Text>
                                        </Group>
                                        <Group gap="sm">
                                            <IconUser
                                                size={20}
                                                className="text-gray-500"
                                            />
                                            <Text className="font-medium">
                                                Experience Level:
                                            </Text>
                                            <Text>
                                                {
                                                    program.program
                                                        .experianceLevel
                                                }
                                            </Text>
                                        </Group>
                                        <Group gap="sm">
                                            <IconCalendar
                                                size={20}
                                                className="text-gray-500"
                                            />
                                            <Text className="font-medium">
                                                Deadline:
                                            </Text>
                                            <Text>
                                                {new Date(
                                                    program.program.deadline,
                                                ).toLocaleDateString()}
                                            </Text>
                                        </Group>
                                    </Stack>
                                </Grid.Col>
                            </Grid>

                            <Divider my="lg" />

                            <Stack>
                                <Title order={3} className="mb-4">
                                    Program Description
                                </Title>
                                <Paper p="md" withBorder>
                                    {program.program.description ? (
                                        <Box className="prose prose-stone max-w-none px-2.5">
                                            {parse(program.program.description)}
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
                                    {program.program.jobDescriptions?.filter(
                                        (desc) =>
                                            desc.type === 'REQUIREMENTS' &&
                                            desc.isActive,
                                    ).length > 0 ? (
                                        <List>
                                            {program.program.jobDescriptions
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
                                    {program.program.jobDescriptions?.filter(
                                        (desc) =>
                                            desc.type === 'RESPONSIBILITY' &&
                                            desc.isActive,
                                    ).length > 0 ? (
                                        <List>
                                            {program.program.jobDescriptions
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
                                    {program.program.jobDescriptions?.filter(
                                        (desc) =>
                                            desc.type === 'BENEFITS' &&
                                            desc.isActive,
                                    ).length > 0 ? (
                                        <List>
                                            {program.program.jobDescriptions
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

                            {program.program.status === 'WAITINGAPPROVAL' && (
                                <Flex justify="flex-end" gap="md" mt="xl">
                                    <Button
                                        color="red"
                                        size="md"
                                        onClick={open}
                                        leftSection={<IconX size={18} />}
                                        className="hover:bg-red-600"
                                        disabled={
                                            approveProgramMutate.isPending
                                        }
                                    >
                                        Decline
                                    </Button>
                                    <Button
                                        color="green"
                                        size="md"
                                        onClick={() =>
                                            approveProgramMutate.mutate()
                                        }
                                        loading={approveProgramMutate.isPending}
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
                <DeclineModal close={close} programId={program?.program.id} />
            </Modal>
        </Container>
    );
};

export default MentorshipDetails;

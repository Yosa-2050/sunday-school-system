'use client';

import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Container,
    Grid,
    Group,
    List,
    Paper,
    SimpleGrid,
    Stack,
    Tabs,
    Text,
    Title,
    useMantineTheme,
} from '@mantine/core';
import {
    IconBriefcase,
    IconChevronLeft,
    IconCircleCheck,
    IconClock,
    IconEdit,
    IconMapPin,
    IconShare,
    IconTrash,
    IconUsers,
    IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import {
    type MentorshipProgram,
    fetchMentorshipProgramsById,
} from 'app/[locale]/_api/admin/fetch-mentorship';
import parse from 'html-react-parser';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export default function MentorshipProgramDetailsPage() {
    const theme = useMantineTheme();
    const params = useParams();
    const programId = params.id as string;

    const { data: program, isLoading } = useQuery<MentorshipProgram>({
        queryKey: ['mentorship', programId],
        queryFn: async () => await fetchMentorshipProgramsById(programId),
    });

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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!program) {
        return <div>Program not found</div>;
    }

    return (
        <Container size="xl" py="xl" px="md">
            <Group mb="xl">
                <Link href="/mentorship-programs" passHref>
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
                                <IconUsers
                                    size={32}
                                    style={{ color: 'primary' }}
                                />
                            </Avatar>
                            <div>
                                <Title order={1} size={32}>
                                    {program.program.title}
                                </Title>
                                <Text size="lg" mt={4}>
                                    Mentorship Program
                                </Text>
                                <Group gap="sm" mt="md">
                                    <Badge
                                        variant="outline"
                                        leftSection={<IconMapPin size={14} />}
                                    >
                                        {program.program.city?.name},{' '}
                                        {program.program.state?.name},{' '}
                                        {program.program.country?.name}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        leftSection={
                                            <IconBriefcase size={14} />
                                        }
                                    >
                                        {program.mentorshipType}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        leftSection={<IconClock size={14} />}
                                    >
                                        {program.duration} months
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        leftSection={<IconUsers size={14} />}
                                    >
                                        {program.audience}
                                    </Badge>
                                </Group>
                            </div>
                        </Group>
                        <Stack gap="sm">
                            <Box>
                                <Badge
                                    color={
                                        statusStyles[
                                            program.program
                                                .status as keyof typeof statusStyles
                                        ]?.includes('green')
                                            ? 'green'
                                            : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                              statusStyles[
                                                    program.program
                                                        .status as keyof typeof statusStyles
                                                ]?.includes('blue')
                                              ? 'blue'
                                              : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                statusStyles[
                                                      program.program
                                                          .status as keyof typeof statusStyles
                                                  ]?.includes('red')
                                                ? 'red'
                                                : 'yellow'
                                    }
                                    variant="filled"
                                    size="lg"
                                    radius="xl"
                                >
                                    {statusText[
                                        program.program
                                            .status as keyof typeof statusText
                                    ] || program.program.status}
                                </Badge>
                            </Box>
                        </Stack>
                    </Group>
                </Stack>
            </Paper>

            <Grid>
                {/* Main content - 2/3 width */}
                <Grid.Col span={{ base: 12, md: 12 }}>
                    <Stack gap="xl">
                        {/* Program Details Card */}
                        <Card withBorder radius="md">
                            <Card.Section
                                withBorder
                                p="md"
                                bg="gray.0"
                                className="flex justify-between"
                            >
                                <Title order={2}>Program Details</Title>
                                <Group gap="xs">
                                    <Text size="md" fw={800} c="gray.9">
                                        Application Deadline:{' '}
                                        {program.program.deadline
                                            ? new Date(
                                                  program.program.deadline,
                                              ).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric',
                                              })
                                            : 'No deadline'}
                                    </Text>
                                </Group>
                            </Card.Section>
                            <Tabs defaultValue="description">
                                <Tabs.List grow>
                                    <Tabs.Tab value="description">
                                        Description
                                    </Tabs.Tab>
                                    <Tabs.Tab value="requirements">
                                        Requirements
                                    </Tabs.Tab>
                                    <Tabs.Tab value="mentor">
                                        Mentor Details
                                    </Tabs.Tab>
                                    <Tabs.Tab value="logistics">
                                        Program Details
                                    </Tabs.Tab>
                                </Tabs.List>
                                <Box p="xl">
                                    <Tabs.Panel value="description">
                                        <Stack>
                                            <Title order={3} className="mb-4">
                                                Program Description
                                            </Title>
                                            <Paper p="md" withBorder>
                                                {program.program.description ? (
                                                    <Box className="prose prose-stone max-w-none px-2.5">
                                                        {parse(
                                                            program.program
                                                                .description,
                                                        )}
                                                    </Box>
                                                ) : (
                                                    <Text className="text-gray-500">
                                                        No description provided
                                                    </Text>
                                                )}
                                            </Paper>
                                        </Stack>

                                        <Stack mt={'md'}>
                                            <Title order={3} className="">
                                                Skills & Expertise
                                            </Title>
                                            <Paper p="md" withBorder>
                                                {(
                                                    program.program.jobSkills ??
                                                    []
                                                ).filter(
                                                    (skill) => skill?.isActive,
                                                ).length > 0 ? (
                                                    <Group gap="xs">
                                                        {(
                                                            program.program
                                                                .jobSkills ?? []
                                                        )
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
                                        <Stack gap="md">
                                            <Title order={3}>
                                                Experience Level
                                            </Title>
                                            <Text>
                                                {
                                                    program.program
                                                        .experianceLevel
                                                }
                                            </Text>

                                            <Title order={3}>
                                                Years of Experience Required
                                            </Title>
                                            <Text>
                                                {program.program.experiance}{' '}
                                                years
                                            </Text>

                                            <Title order={3}>
                                                Educational Requirements
                                            </Title>
                                            <Text>
                                                {program.program
                                                    .educationalRequirment ||
                                                    'Not specified'}
                                            </Text>

                                            <Title order={3}>
                                                Additional Notes
                                            </Title>
                                            <Text>
                                                {program.program.notes ||
                                                    'No additional notes'}
                                            </Text>

                                            <Title order={3}>
                                                Program Requirements
                                            </Title>
                                            <List>
                                                {(
                                                    program.program
                                                        .jobDescriptions ?? []
                                                )
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
                                                                        theme
                                                                            .colors
                                                                            .teal[5]
                                                                    }
                                                                />
                                                            }
                                                        >
                                                            <Text c="gray.7">
                                                                {
                                                                    req.description
                                                                }
                                                            </Text>
                                                        </List.Item>
                                                    ))}
                                            </List>
                                        </Stack>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="mentor">
                                        <Stack gap="md">
                                            <Title order={3}>
                                                Mentor Information
                                            </Title>
                                            <Group gap="lg">
                                                <Avatar size={64} radius="xl" />
                                                <div>
                                                    <Text size="lg" fw={500}>
                                                        {
                                                            program.mentor
                                                                .profile
                                                                .firstName
                                                        }{' '}
                                                        {
                                                            program.mentor
                                                                .profile
                                                                .lastName
                                                        }
                                                    </Text>
                                                    <Text c="dimmed">
                                                        {
                                                            program.mentor
                                                                .profile.title
                                                        }
                                                    </Text>
                                                    <Text>
                                                        {
                                                            program.mentor
                                                                .profile
                                                                .phoneNumber
                                                        }
                                                    </Text>
                                                </div>
                                            </Group>

                                            <Title order={3}>
                                                Mentor Status
                                            </Title>
                                            <Badge
                                                color={
                                                    program.mentor.status ===
                                                    'APPROVED'
                                                        ? 'green'
                                                        : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                          program.mentor
                                                                .status ===
                                                            'DECLINED'
                                                          ? 'red'
                                                          : 'yellow'
                                                }
                                                variant="filled"
                                            >
                                                {program.mentor.status}
                                            </Badge>

                                            <Title order={3}>
                                                Mentor Notes
                                            </Title>
                                            <Text>
                                                {program.mentor.note ||
                                                    'No notes provided'}
                                            </Text>
                                        </Stack>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="logistics">
                                        <Stack gap="md">
                                            <Title order={3}>
                                                Program Type
                                            </Title>
                                            <Text>
                                                {program.mentorshipType}
                                            </Text>

                                            <Title order={3}>
                                                Commitment Level
                                            </Title>
                                            <Text>{program.commitment}</Text>

                                            <Title order={3}>
                                                Program Duration
                                            </Title>
                                            <Text>
                                                {program.duration} months
                                            </Text>

                                            <Title order={3}>
                                                Target Audience
                                            </Title>
                                            <Text>{program.audience}</Text>

                                            <Title order={3}>
                                                Workplace Type
                                            </Title>
                                            <Text>
                                                {program.program.workPlace}
                                            </Text>

                                            <Title order={3}>
                                                Number of Applicants
                                            </Title>
                                            <Text>
                                                {
                                                    program.program
                                                        .numberOfApplicants
                                                }
                                            </Text>
                                        </Stack>
                                    </Tabs.Panel>
                                </Box>
                            </Tabs>
                            <Card.Section withBorder p="md" bg="gray.0" hidden>
                                <Group justify="space-between">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        leftSection={<IconShare size={14} />}
                                    >
                                        Share
                                    </Button>
                                    <Group hidden>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            leftSection={<IconEdit size={14} />}
                                        >
                                            Edit Program
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            leftSection={
                                                <IconTrash size={14} />
                                            }
                                            color="red"
                                        >
                                            Delete Program
                                        </Button>
                                    </Group>
                                </Group>
                            </Card.Section>
                        </Card>

                        {/* Applicants Card */}
                        <Card withBorder radius="md" hidden>
                            <Card.Section withBorder p="md" bg="gray.0">
                                <Group>
                                    <IconUsers
                                        size={20}
                                        color={theme.colors.gray[6]}
                                    />
                                    <Title order={2}>Applicants</Title>
                                </Group>
                                <Text c="gray.6">
                                    Track applicants for this mentorship program
                                </Text>
                            </Card.Section>
                            <Box p="xl">
                                <SimpleGrid cols={{ base: 1, md: 3 }}>
                                    <Paper withBorder p="md" radius="md">
                                        <Group justify="space-between">
                                            <Group gap="xs">
                                                <IconUsers
                                                    size={20}
                                                    color={theme.colors.gray[6]}
                                                />
                                                <Text size="sm" fw={500}>
                                                    Total Applicants
                                                </Text>
                                            </Group>
                                            <Title order={3}>
                                                {
                                                    program.program
                                                        .numberOfApplicants
                                                }
                                            </Title>
                                        </Group>
                                    </Paper>
                                    <Paper withBorder p="md" radius="md">
                                        <Group justify="space-between">
                                            <Group gap="xs">
                                                <IconCircleCheck
                                                    size={20}
                                                    color={
                                                        theme.colors.green[6]
                                                    }
                                                />
                                                <Text size="sm" fw={500}>
                                                    Accepted
                                                </Text>
                                            </Group>
                                            <Title order={3} c="green">
                                                0
                                            </Title>
                                        </Group>
                                    </Paper>
                                    <Paper withBorder p="md" radius="md">
                                        <Group justify="space-between">
                                            <Group gap="xs">
                                                <IconX
                                                    size={20}
                                                    color={theme.colors.red[6]}
                                                />
                                                <Text size="sm" fw={500}>
                                                    Rejected
                                                </Text>
                                            </Group>
                                            <Title order={3} c="red">
                                                0
                                            </Title>
                                        </Group>
                                    </Paper>
                                </SimpleGrid>
                            </Box>
                        </Card>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Container>
    );
}

import {
    Avatar,
    Badge,
    Box,
    Divider,
    Group,
    List,
    Rating,
    Stack,
    Text,
    Title,
    TypographyStylesProvider,
    useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
    IconBuilding,
    IconCalendar,
    IconCheck,
    IconClock,
    IconCurrencyDollar,
    IconMapPin,
} from '@tabler/icons-react';
import type { Job } from 'app/_api/jobs/fetch-job-id';

import parse from 'html-react-parser';

type ApplicationOverviewProps = {
    job: Job;
};

export const ApplicationOverview = ({
    job: _job,
}: ApplicationOverviewProps) => {
    const job = _job.program;
    const theme = useMantineTheme();
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <Stack gap="md">
            <Group wrap="nowrap">
                <Avatar
                    size={isMobile ? 'sm' : 'lg'}
                    radius="md"
                    src="/placeholder.svg"
                    alt="TechCorp Logo"
                />
                <Stack gap={0}>
                    <Title visibleFrom="md" order={1} hiddenFrom="md">
                        {job.title}
                    </Title>
                    <Group gap="xs" wrap="wrap">
                        <Group gap={4}>
                            <IconBuilding size={14} color="gray" />
                            <Text size="xs" color="dimmed">
                                {job.organization?.name}
                            </Text>
                        </Group>
                        <Divider orientation="vertical" />
                        <Rating value={4.5} fractions={2} readOnly size="xs" />
                        <Text size="xs" color="dimmed">
                            4.5 (126 reviews)
                        </Text>
                    </Group>
                    <Group gap="md" mt={4} wrap="wrap">
                        <Group gap={4}>
                            <IconMapPin size={14} color="gray" />
                            <Text size="xs" color="dimmed">
                                {job.workPlace || 'Remote'}
                            </Text>
                        </Group>
                        <Group gap={4}>
                            <IconCurrencyDollar size={14} color="gray" />
                            <Text size="xs" color="dimmed">
                                {(() => {
                                    if (job?.salaryFrom && job?.salaryTo) {
                                        return `${job.salaryFrom.toLocaleString()} - ${job.salaryTo.toLocaleString()} ${job.currency}`;
                                    }
                                    if (job?.salaryFrom) {
                                        return `${job.salaryFrom.toLocaleString()} ${job.currency}`;
                                    }
                                    return 'N/A';
                                })()}
                            </Text>
                        </Group>
                        <Group gap={4}>
                            <IconClock size={14} color="gray" />
                            <Text size="xs" color="dimmed">
                                {job.type}
                            </Text>
                        </Group>
                        <Group gap={4}>
                            <IconCalendar size={14} color="gray" />
                            <Text size="xs" color="dimmed">
                                Posted 3 days ago
                            </Text>
                        </Group>
                    </Group>
                </Stack>
            </Group>

            <Stack gap="md">
                <Stack gap="xs">
                    <Group>
                        <Title visibleFrom="md" order={4} hiddenFrom="md">
                            Job Description
                        </Title>
                        <Badge size="xs">New</Badge>
                    </Group>
                    <TypographyStylesProvider>
                        <Box className="prose prose-stone max-w-none">
                            {parse(job.description)}
                        </Box>
                    </TypographyStylesProvider>
                </Stack>

                <Stack gap="xs">
                    <Title order={4}>Requirements</Title>
                    <List size="xs" color="dimmed">
                        {job.jobDescriptions?.filter(
                            (desc) =>
                                desc.type === 'REQUIREMENTS' && desc.isActive,
                        ).length > 0 ? (
                            job.jobDescriptions
                                .filter(
                                    (desc) =>
                                        desc.type === 'REQUIREMENTS' &&
                                        desc.isActive,
                                )
                                .map((req) => (
                                    <List.Item
                                        key={req.id}
                                        icon={
                                            <IconCheck
                                                size={14}
                                                color={theme.colors.teal[5]}
                                            />
                                        }
                                    >
                                        {req.description}
                                    </List.Item>
                                ))
                        ) : (
                            <Text size="xs" color="dimmed">
                                No requirements provided
                            </Text>
                        )}
                    </List>
                </Stack>

                <Stack gap="xs">
                    <Title order={4}>Responsibilities</Title>
                    <List size="xs" color="dimmed">
                        {job.jobDescriptions?.filter(
                            (desc) =>
                                desc.type === 'RESPONSIBILITY' && desc.isActive,
                        ).length > 0 ? (
                            job.jobDescriptions
                                .filter(
                                    (desc) =>
                                        desc.type === 'RESPONSIBILITY' &&
                                        desc.isActive,
                                )
                                .map((resp) => (
                                    <List.Item
                                        key={resp.id}
                                        icon={
                                            <IconCheck
                                                size={14}
                                                color={theme.colors.teal[5]}
                                            />
                                        }
                                    >
                                        {resp.description}
                                    </List.Item>
                                ))
                        ) : (
                            <Text size="xs" color="dimmed">
                                No responsibilities provided
                            </Text>
                        )}
                    </List>
                </Stack>

                <Stack gap="xs">
                    <Title order={4}>Benefits</Title>
                    <List size="xs" color="dimmed">
                        {job.jobDescriptions?.filter(
                            (desc) => desc.type === 'BENEFITS' && desc.isActive,
                        ).length > 0 ? (
                            job.jobDescriptions
                                .filter(
                                    (desc) =>
                                        desc.type === 'BENEFITS' &&
                                        desc.isActive,
                                )
                                .map((benefit) => (
                                    <List.Item
                                        key={benefit.id}
                                        icon={
                                            <IconCheck
                                                size={14}
                                                color={theme.colors.teal[5]}
                                            />
                                        }
                                    >
                                        {benefit.description}
                                    </List.Item>
                                ))
                        ) : (
                            <Text size="xs" color="dimmed">
                                No benefits provided
                            </Text>
                        )}
                    </List>
                </Stack>

                <Stack gap="xs">
                    <Title order={4}>Skills & Expertise</Title>
                    <Group gap="xs">
                        {job.jobSkills?.filter((skill) => skill.isActive)
                            .length > 0 ? (
                            job.jobSkills
                                .filter((skill) => skill.isActive)
                                .map((skill) => (
                                    <Badge key={skill.id} variant="outline">
                                        {skill.skill}
                                    </Badge>
                                ))
                        ) : (
                            <Text size="xs" color="dimmed">
                                No skills provided
                            </Text>
                        )}
                    </Group>
                </Stack>
            </Stack>
        </Stack>
    );
};

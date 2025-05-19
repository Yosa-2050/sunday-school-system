import {
    Avatar,
    Badge,
    Box,
    Card,
    Container,
    Grid,
    Group,
    List,
    Paper,
    Progress,
    Stack,
    Tabs,
    Text,
    Title,
    useMantineTheme,
} from '@mantine/core';
import {
    IconBriefcase,
    IconBuilding,
    IconCalendar,
    IconCircleCheck,
    IconMapPin,
    IconSchool,
    IconUser,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { getAddressById } from 'app/[locale]/_api/organizations/get-addresses';
import { getCategoriesById } from 'app/[locale]/_api/organizations/get-categories';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import type { JobFormData } from './types';

interface JobPreviewProps {
    formData: JobFormData;
}

export const JobPreview = ({ formData }: JobPreviewProps) => {
    const theme = useMantineTheme();

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const country = useQuery({
        queryFn: () => getAddressById(formData.countryId),
        queryKey: ['country', formData.countryId],
    });
    const state = useQuery({
        queryFn: () => getAddressById(formData.stateId),
        queryKey: ['state', formData.stateId],
    });
    const city = useQuery({
        queryFn: () => getAddressById(formData.cityId),
        queryKey: ['city', formData.cityId],
    });

    const [categoryNames, setCategoryNames] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const names = await Promise.all(
                formData.catagories.map(async (id: string) => {
                    const result = await getCategoriesById(id);
                    return result.name;
                }),
            );
            setCategoryNames(names);
        };

        if (formData.catagories?.length) {
            fetchCategories();
        }
    }, [formData.catagories]);

    return (
        <Container size="xl" py="xl" px="md">
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
                                    {formData.title}
                                </Title>
                                <Group gap="sm" mt="md">
                                    <Badge
                                        variant="outline"
                                        leftSection={<IconMapPin size={14} />}
                                    >
                                        {city?.data?.name}, {state?.data?.name},{' '}
                                        {country?.data?.name}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        leftSection={
                                            <IconBriefcase size={14} />
                                        }
                                    >
                                        {formData.mentorshipType}
                                    </Badge>

                                    <Badge
                                        variant="outline"
                                        leftSection={<IconUser size={14} />}
                                    >
                                        {formData.experianceLevel} Level
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        leftSection={<IconSchool size={14} />}
                                    >
                                        {formData.educationalRequirment}
                                    </Badge>
                                </Group>
                            </div>
                        </Group>
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
                                </Tabs.List>
                                <Box p="xl">
                                    <Tabs.Panel value="description">
                                        <Stack className="mb-4">
                                            <Title order={3}>
                                                Job Description
                                            </Title>
                                            <Paper p="md" withBorder>
                                                <Box className="prose prose-stone max-w-none px-2.5">
                                                    {parse(
                                                        formData.description,
                                                    )}
                                                </Box>
                                            </Paper>
                                        </Stack>

                                        <Stack className="mb-4">
                                            <Title order={3}>
                                                Requirements
                                            </Title>
                                            <Paper p="md" withBorder>
                                                <List>
                                                    {formData.jobDescriptions
                                                        ?.filter(
                                                            (desc) =>
                                                                desc.type ===
                                                                'REQUIREMENTS',
                                                        )
                                                        .map((req, index) => (
                                                            <List.Item
                                                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                                key={index}
                                                                icon={
                                                                    <IconCircleCheck
                                                                        size={
                                                                            18
                                                                        }
                                                                        color={
                                                                            theme
                                                                                .colors
                                                                                .teal[5]
                                                                        }
                                                                    />
                                                                }
                                                            >
                                                                <Text>
                                                                    {
                                                                        req.description
                                                                    }
                                                                </Text>
                                                            </List.Item>
                                                        ))}
                                                </List>
                                            </Paper>
                                        </Stack>

                                        <Stack className="mb-4">
                                            <Title order={3}>
                                                Responsibilities
                                            </Title>
                                            <Paper p="md" withBorder>
                                                <List>
                                                    {formData.jobDescriptions
                                                        ?.filter(
                                                            (desc) =>
                                                                desc.type ===
                                                                'RESPONSIBILITY',
                                                        )
                                                        .map((resp, index) => (
                                                            <List.Item
                                                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                                key={index}
                                                                icon={
                                                                    <IconCircleCheck
                                                                        size={
                                                                            18
                                                                        }
                                                                        color={
                                                                            theme
                                                                                .colors
                                                                                .teal[5]
                                                                        }
                                                                    />
                                                                }
                                                            >
                                                                <Text>
                                                                    {
                                                                        resp.description
                                                                    }
                                                                </Text>
                                                            </List.Item>
                                                        ))}
                                                </List>
                                            </Paper>
                                        </Stack>

                                        <Stack className="mb-4">
                                            <Title order={3}>Benefits</Title>
                                            <Paper p="md" withBorder>
                                                <List>
                                                    {formData.jobDescriptions
                                                        ?.filter(
                                                            (desc) =>
                                                                desc.type ===
                                                                'BENEFITS',
                                                        )
                                                        .map(
                                                            (
                                                                benefit,
                                                                index,
                                                            ) => (
                                                                <List.Item
                                                                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                                    key={index}
                                                                    icon={
                                                                        <IconCircleCheck
                                                                            size={
                                                                                18
                                                                            }
                                                                            color={
                                                                                theme
                                                                                    .colors
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
                                                            ),
                                                        )}
                                                </List>
                                            </Paper>
                                        </Stack>

                                        <Stack className="mb-4">
                                            <Title order={3}>
                                                Skills & Expertise
                                            </Title>
                                            <Paper p="md" withBorder>
                                                <Group gap="xs">
                                                    {formData.skills.map(
                                                        (skill) => (
                                                            <Badge
                                                                key={skill}
                                                                variant="outline"
                                                            >
                                                                {skill}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </Group>
                                            </Paper>
                                        </Stack>

                                        <Stack className="mb-4">
                                            <Title order={3}>Categories</Title>
                                            <Paper p="md" withBorder>
                                                <Group gap="xs">
                                                    {categoryNames.map(
                                                        (name) => (
                                                            <Badge
                                                                key={name}
                                                                variant="outline"
                                                            >
                                                                {name}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </Group>
                                            </Paper>
                                        </Stack>

                                        {formData.additionalInfo && (
                                            <Stack hidden>
                                                <Title order={3}>
                                                    Additional Information
                                                </Title>
                                                <Paper p="md" withBorder>
                                                    <Text>
                                                        {
                                                            formData.additionalInfo
                                                        }
                                                    </Text>
                                                </Paper>
                                            </Stack>
                                        )}
                                    </Tabs.Panel>
                                </Box>
                            </Tabs>
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
                                                Posted {formatDate(new Date())}
                                            </Text>
                                        </Group>
                                        <Badge variant="filled" color="gray">
                                            {Math.ceil(
                                                (new Date(
                                                    formData.deadline,
                                                ).getTime() -
                                                    Date.now()) /
                                                    (1000 * 60 * 60 * 24),
                                            )}{' '}
                                            days left
                                        </Badge>
                                    </Group>
                                    <div>
                                        <Group justify="space-between" mb="xs">
                                            <Text size="sm" fw={500}>
                                                Time Remaining
                                            </Text>
                                            <Text size="sm" c="gray.6" fw={500}>
                                                {Math.round(
                                                    ((new Date(
                                                        formData.deadline,
                                                    ).getTime() -
                                                        Date.now()) /
                                                        (new Date(
                                                            formData.deadline,
                                                        ).getTime() -
                                                            Date.now())) *
                                                        100,
                                                )}
                                                %
                                            </Text>
                                        </Group>
                                        <Progress
                                            value={Math.round(
                                                ((new Date(
                                                    formData.deadline,
                                                ).getTime() -
                                                    Date.now()) /
                                                    (new Date(
                                                        formData.deadline,
                                                    ).getTime() -
                                                        Date.now())) *
                                                    100,
                                            )}
                                            size="sm"
                                            mb="xs"
                                        />
                                    </div>
                                </Stack>
                            </Card.Section>
                        </Card>

                        {/* Application Details Card */}
                        <Card withBorder radius="md">
                            <Card.Section withBorder p="md" bg="gray.0">
                                <Title order={2}>Application Details</Title>
                            </Card.Section>
                            <Card.Section p="xl">
                                <Stack gap="md">
                                    {formData.contactEmail && (
                                        <Group gap="xs">
                                            <Text size="sm" fw={500}>
                                                Contact Email:
                                            </Text>
                                            <Text size="sm">
                                                {formData.contactEmail}
                                            </Text>
                                        </Group>
                                    )}
                                    {formData.applicationUrl && (
                                        <Group gap="xs">
                                            <Text size="sm" fw={500}>
                                                Application URL:
                                            </Text>
                                            <Text size="sm">
                                                <a
                                                    href={
                                                        formData.applicationUrl
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {formData.applicationUrl}
                                                </a>
                                            </Text>
                                        </Group>
                                    )}
                                    <Group gap="xs">
                                        <Text size="sm" fw={500}>
                                            Work Place:
                                        </Text>
                                        <Text size="sm">
                                            {formData.workPlace}
                                        </Text>
                                    </Group>
                                    <Group gap="xs">
                                        <Text size="sm" fw={500}>
                                            Experience:
                                        </Text>
                                        <Text size="sm">
                                            {formData.experiance} years
                                        </Text>
                                    </Group>
                                    <Group gap="xs">
                                        <Text size="sm" fw={500}>
                                            Deadline:
                                        </Text>
                                        <Text size="sm">
                                            {formatDate(formData.deadline)}
                                        </Text>
                                    </Group>
                                </Stack>
                            </Card.Section>
                        </Card>

                        {/* Actions Card */}
                    </Stack>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

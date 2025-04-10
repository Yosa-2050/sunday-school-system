import {
    Badge,
    Box,
    Divider,
    Grid,
    Group,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import {
    IconBriefcase,
    IconBuilding,
    IconCalendar,
    IconCapRounded,
    IconCurrencyDollar,
} from '@tabler/icons-react';
import parse from 'html-react-parser';
import type { JobFormData } from './types';

interface JobPreviewProps {
    formData: JobFormData;
}

export const JobPreview = ({ formData }: JobPreviewProps) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatSalary = (from: number, to: number, frequency: string) => {
        return `${from.toLocaleString()} - ${to.toLocaleString()} ${frequency}`;
    };

    return (
        <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Stack gap="xl">
                {/* Header Section */}
                <div>
                    <Title order={2} mb="xs">
                        {formData.title}
                    </Title>
                    <Group gap="xs" mb="md">
                        <Badge size="lg" variant="light">
                            {formData.type}
                        </Badge>
                        <Badge size="lg" variant="light">
                            {formData.workPlace}
                        </Badge>
                    </Group>
                </div>

                <Divider />

                {/* Key Details Section */}
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Group gap="xs" mb="md">
                            <IconBuilding size={20} className="text-gray-500" />
                            <Text size="sm" c="dimmed">
                                {formData.type}
                            </Text>
                        </Group>
                    </Grid.Col>

                    {/* <Grid.Col span={{ base: 12, sm: 6 }}>
            <Group gap="xs" mb="md">
              <IconMapPin size={20} className="text-gray-500" />
              <Text size="sm" c="dimmed">
                {formData.cityId} • {formData.stateId} • {formData.countryId}
              </Text>
            </Group>
          </Grid.Col> */}

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Group gap="xs" mb="md">
                            <IconCurrencyDollar
                                size={20}
                                className="text-gray-500"
                            />
                            <Text size="sm" c="dimmed">
                                {formatSalary(
                                    formData.salaryFrom,
                                    formData.salaryTo,
                                    formData.salaryFrequency,
                                )}
                            </Text>
                        </Group>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Group gap="xs" mb="md">
                            <IconCalendar size={20} className="text-gray-500" />
                            <Text size="sm" c="dimmed">
                                Apply by {formatDate(formData.deadline)}
                            </Text>
                        </Group>
                    </Grid.Col>
                </Grid>

                <Divider />

                {/* Requirements Section */}
                <div>
                    <Title order={3} mb="md">
                        Requirements
                    </Title>
                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Group gap="xs" mb="md">
                                <IconBriefcase
                                    size={20}
                                    className="text-gray-500"
                                />
                                <Text size="sm" c="dimmed">
                                    {formData.experianceLevel} Level •{' '}
                                    {formData.experiance} years experience
                                </Text>
                            </Group>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Group gap="xs" mb="md">
                                <IconCapRounded
                                    size={20}
                                    className="text-gray-500"
                                />
                                <Text size="sm" c="dimmed">
                                    {formData.educationalRequirment}
                                </Text>
                            </Group>
                        </Grid.Col>
                    </Grid>

                    <div className="mb-4">
                        <Text fw={500} size="sm" mb="xs">
                            Required Skills
                        </Text>
                        <Group gap="xs">
                            {formData.skills.map((skill) => (
                                <Badge key={skill} size="sm" variant="light">
                                    {skill}
                                </Badge>
                            ))}
                        </Group>
                    </div>

                    {/* <div>
                        <Text fw={500} size="sm" mb="xs">
                            Job Categories
                        </Text>
                        <Group gap="xs">
                            {formData.catagories.map((category) => (
                                <Badge key={category} size="sm" variant="light">
                                    {category}
                                </Badge>
                            ))}
                        </Group> */}
                    {/* </div> */}
                </div>

                <Divider />

                {/* Description Section */}
                <div>
                    <Title order={3} mb="md">
                        Job Description
                    </Title>
                    <Box className="prose prose-stone max-w-none px-2.5">
                        {parse(formData.description)}
                    </Box>
                </div>

                {/* Application Details Section */}
                {(formData.contactEmail || formData.applicationUrl) && (
                    <>
                        <Divider />
                        <div>
                            <Title order={3} mb="md">
                                How to Apply
                            </Title>
                            <Stack gap="xs">
                                {formData.contactEmail && (
                                    <Text size="sm">
                                        <strong>Email:</strong>{' '}
                                        {formData.contactEmail}
                                    </Text>
                                )}
                                {formData.applicationUrl && (
                                    <Text size="sm">
                                        <strong>Application URL:</strong>{' '}
                                        <a
                                            href={formData.applicationUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {formData.applicationUrl}
                                        </a>
                                    </Text>
                                )}
                            </Stack>
                        </div>
                    </>
                )}

                {/* Additional Information */}
                {formData.additionalInfo && (
                    <>
                        <Divider />
                        <div>
                            <Title order={3} mb="md">
                                Additional Information
                            </Title>
                            <Box className="prose prose-stone max-w-none px-2.5">
                                {parse(formData.additionalInfo)}
                            </Box>
                        </div>
                    </>
                )}
            </Stack>
        </Paper>
    );
};

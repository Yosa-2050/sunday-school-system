import {
    ActionIcon,
    Alert,
    Badge,
    Box,
    Divider,
    Flex,
    Grid,
    Group,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import {
    IconAlertCircle,
    IconArrowLeft,
    IconBriefcase,
    IconCalendar,
    IconCurrencyDollar,
    IconMapPin,
} from '@tabler/icons-react';
import type { JobDetailsViewProps } from 'app/[locale]/_api/admin/fetch-jobs-by-id';
import parse from 'html-react-parser';
import { useRouter } from 'next/navigation';

export const JobDetailsEdit = ({ job }: { job: JobDetailsViewProps }) => {
    const router = useRouter();

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatSalary = (
        from: number,
        to: number,
        currency: string,
        frequency: string,
    ) => {
        return `${from.toLocaleString()} - ${to.toLocaleString()} ${currency} ${frequency.toLowerCase()}`;
    };

    const handleBack = () => {
        router.back();
    };

    const getLocationString = () => {
        const parts = [job.city.name, job.state.name, job.country.name];
        return parts.filter(Boolean).join(', ');
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
        <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Stack gap="xl">
                {/* Header Section */}
                <Flex justify="space-between" align="center">
                    <Group gap="md">
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="lg"
                            onClick={handleBack}
                            aria-label="Back to previous page"
                        >
                            <IconArrowLeft size={24} />
                        </ActionIcon>
                        <div>
                            <Title order={2} mb="xs">
                                {job.title}
                            </Title>
                            <Text size="lg" fw={600} c="dimmed">
                                {job.organization.name}
                            </Text>
                        </div>
                    </Group>
                    <Group>
                        <Badge
                            size="lg"
                            variant="filled"
                            color={job.isActive ? 'green' : 'red'}
                        >
                            {job.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge size="lg" variant="light">
                            {job.type.replace(/_/g, ' ')}
                        </Badge>
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                statusStyles[
                                    job.status as keyof typeof statusStyles
                                ] || 'bg-yellow-300'
                            } text-white`}
                            autoCapitalize="none"
                        >
                            {statusText[job.status]}
                        </span>
                    </Group>
                </Flex>

                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Job Status"
                    color={job.isActive ? 'green' : 'red'}
                    variant="light"
                >
                    <Text>
                        {job.isActive
                            ? 'This job is currently active and accepting applications.'
                            : 'This job is currently inactive.'}
                    </Text>
                </Alert>

                <Divider />

                {/* Key Details Section */}
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Group gap="xs" mb="md">
                            <IconMapPin size={20} className="text-gray-500" />
                            <Text size="sm" c="dimmed">
                                {getLocationString()}
                            </Text>
                        </Group>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Group gap="xs" mb="md">
                            <IconCurrencyDollar
                                size={20}
                                className="text-gray-500"
                            />
                            <Text size="sm" c="dimmed">
                                {formatSalary(
                                    job.salaryFrom,
                                    job.salaryTo,
                                    job.currency,
                                    job.salaryFrequency,
                                )}
                            </Text>
                        </Group>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Group gap="xs" mb="md">
                            <IconBriefcase
                                size={20}
                                className="text-gray-500"
                            />
                            <Text size="sm" c="dimmed">
                                {job.experiance} years experience (
                                {job.experianceLevel.toLowerCase()})
                            </Text>
                        </Group>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Group gap="xs" mb="md">
                            <IconCalendar size={20} className="text-gray-500" />
                            <Text size="sm" c="dimmed">
                                Application Deadline: {formatDate(job.deadline)}
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
                                    Education: {job.educationalRequirment}
                                </Text>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </div>

                <Divider />

                {/* Description Section */}
                <div>
                    <Title order={3} mb="md">
                        Job Description
                    </Title>
                    <Box className="prose prose-stone max-w-none px-2.5">
                        {parse(job.description)}
                    </Box>
                </div>

                {/* Organization Details */}
                {job.organization.description && (
                    <>
                        <Divider />
                        <div>
                            <Title order={3} mb="md">
                                About the Organization
                            </Title>
                            <Text size="sm" c="dimmed">
                                {job.organization.description}
                            </Text>
                        </div>
                    </>
                )}

                {/* Posted By Information */}
                <Divider />
                <div>
                    <Title order={3} mb="md">
                        Posted By
                    </Title>
                    <Text size="sm" c="dimmed">
                        {job.postedBy.employee.profile.firstName}{' '}
                        {job.postedBy.employee.profile.middleName}{' '}
                        {job.postedBy.employee.profile.lastName}
                    </Text>
                </div>
            </Stack>
        </Paper>
    );
};

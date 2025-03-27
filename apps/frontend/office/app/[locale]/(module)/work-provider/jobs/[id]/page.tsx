'use client';

import { useRouter } from '@/i18n/routing';
import {
    ActionIcon,
    Alert,
    Badge,
    Box,
    Container,
    Divider,
    Flex,
    Group,
    LoadingOverlay,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchJobsAdminById } from 'app/[locale]/_api/admin/fetch-jobs-by-id';
import parse from 'html-react-parser';
import { useParams } from 'next/navigation';

interface JobDetailsResponse {
    id: string;
    isActive: boolean;
    title: string;
    description: string;
    type: string;
    salaryFrom: number;
    salaryTo: number;
    status: string;
    location: string;
    experience: number;
    workplaceType: string;
    industry: string;
    postedAt: string;
    organization: {
        id: string;
        name: string;
        description: string;
    };
    postedBy: {
        employee: {
            profile: {
                firstName: string;
                lastName: string;
            };
        };
    };
}

const JobDetails = () => {
    const params = useParams();
    const router = useRouter();
    const jobId = params.id as string;

    const { data: job, isLoading } = useQuery({
        queryKey: ['job', jobId],
        queryFn: () => fetchJobsAdminById(jobId),
    });

    // Handle back navigation
    const handleBack = () => {
        router.back();
    };

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (!job) {
        return <Text>Job not found</Text>;
    }

    const firstLineOfDescription = job.description.split('\n')[0];

    return (
        <Container
            fluid
            style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}
        >
            <Flex
                gap="xl"
                align="start"
                direction={{ base: 'column', md: 'row' }}
            >
                {/* Main Job Details Section */}
                <Paper
                    shadow="md"
                    radius="lg"
                    p={{ base: 'md', md: 'xl' }}
                    flex={1}
                    style={{ backgroundColor: '#fff' }}
                >
                    <Flex justify="space-between" align="center" mb="lg">
                        <Flex align="center" gap="md">
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                size="lg"
                                onClick={handleBack}
                                aria-label="Back to previous page"
                            >
                                <IconArrowLeft size={24} />
                            </ActionIcon>
                            <Title
                                order={2}
                                style={{
                                    color: '#1a202c',
                                    fontSize: '1.75rem',
                                    fontWeight: 700,
                                }}
                            >
                                {job.title
                                    .split(' ')
                                    .map(
                                        (word) =>
                                            word.charAt(0).toUpperCase() +
                                            word.slice(1),
                                    )
                                    .join(' ')}
                            </Title>
                        </Flex>
                    </Flex>

                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Job Status"
                        color={job.isActive ? 'green' : 'red'}
                        mb="lg"
                    >
                        <Text>
                            {job.isActive
                                ? 'This job is currently active.'
                                : 'This job is inactive.'}
                        </Text>
                    </Alert>

                    <Text
                        size="lg"
                        fw={600}
                        mb="sm"
                        style={{ color: '#2d3748' }}
                    >
                        {job.organization.name}
                    </Text>

                    <Flex wrap="wrap" gap="sm" mb="lg">
                        <Badge
                            variant="filled"
                            color={job.isActive ? 'green' : 'red'}
                            size="lg"
                            radius="sm"
                        >
                            {job.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge
                            variant="outline"
                            color="gray"
                            size="lg"
                            radius="sm"
                        >
                            Job Type: {job.type}
                        </Badge>
                    </Flex>

                    <Divider my="lg" />

                    <Stack gap="sm">
                        <Title
                            order={3}
                            style={{
                                color: '#1a202c',
                                fontSize: '1.25rem',
                                fontWeight: 600,
                            }}
                        >
                            Job Description
                        </Title>
                        <Group gap="xs">
                            <Text
                                fw={500}
                                style={{ color: '#2d3748', minWidth: '200px' }}
                            >
                                Job Title:
                            </Text>
                            <Text style={{ color: '#4a5568' }}>
                                {job.title}
                            </Text>
                        </Group>
                        <Group gap="xs">
                            <Text
                                fw={500}
                                style={{ color: '#2d3748', minWidth: '200px' }}
                            >
                                Job Type:
                            </Text>
                            <Text style={{ color: '#4a5568' }}>
                                {job.type.includes('_')
                                    ? job.type
                                          .split('_')
                                          .map(
                                              (word) =>
                                                  word.charAt(0).toUpperCase() +
                                                  word.slice(1).toLowerCase(),
                                          )
                                          .join(' ')
                                    : job.type.charAt(0).toUpperCase() +
                                      job.type.slice(1)}
                            </Text>
                        </Group>
                        <Group gap="xs">
                            <Text
                                fw={500}
                                style={{ color: '#2d3748', minWidth: '200px' }}
                            >
                                Salary:
                            </Text>
                            <Text style={{ color: '#4a5568' }}>
                                {/* Up to {job.salaryTo.toLocaleString()}
                                {job.currency} per year */}
                                {job.salaryFrom.toLocaleString()} -{' '}
                                {job.salaryTo.toLocaleString()} {job.currency}
                            </Text>
                        </Group>
                        {/* <Group gap="xs" align="flex-start">
                            <Text
                                fw={500}
                                style={{ color: '#2d3748', minWidth: '200px' }}
                            >
                                Skills Required:
                            </Text>
                            <Stack gap={0}>
                                <Text style={{ color: '#4a5568' }}>
                                    - React
                                </Text>
                                <Text style={{ color: '#4a5568' }}>
                                    - Laravel
                                </Text>
                                <Text style={{ color: '#4a5568' }}>
                                    - Python
                                </Text>
                            </Stack>
                        </Group> */}
                    </Stack>

                    <Divider my="lg" />

                    <Box className="prose prose-stone max-w-none px-2.5">
                        {parse(job.description)}
                    </Box>
                </Paper>
            </Flex>
        </Container>
    );
};

export default JobDetails;

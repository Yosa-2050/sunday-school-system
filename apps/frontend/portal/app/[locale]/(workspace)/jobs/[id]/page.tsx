'use client';

import { useRouter } from '@/i18n/routing';
import {
    ActionIcon,
    Avatar,
    Card,
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
import { IconArrowLeft, IconMail, IconPhone } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchJobsById } from 'app/_api/jobs/fetch-job-id';
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
    const jobId = params.id as string;
    const router = useRouter();

    const { data: job, isLoading } = useQuery({
        queryKey: ['job', jobId],
        queryFn: () => fetchJobsById(jobId),
    });

    const handleBack = () => {
        router.back();
    };

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (!job) {
        return <Text>Job not found</Text>;
    }

    return (
        <Container size={'xl'} mt={'xl'}>
            <Flex
                gap="xl"
                align="start"
                direction={{ base: 'column', md: 'row' }}
            >
                {/* Employer Card */}
                <Card shadow="md" p="xl" radius="lg" w={300} bg="gray.0">
                    <Flex align="center" direction="column" gap="md">
                        <Avatar
                            size={90}
                            radius="xl"
                            src="/avatar.png"
                            alt="Employer"
                        />
                        <Text fw={600} size="lg">
                            {job.postedBy.employee.profile.firstName}{' '}
                            {job.postedBy.employee.profile.lastName}
                        </Text>
                        <Text size="sm" color="dimmed">
                            {job.organization.name}
                        </Text>
                        <Divider my="md" />
                        <Group gap="xs">
                            <IconPhone size={16} />
                            <Text size="sm">+251 9 123 456 78</Text>
                        </Group>
                        <Group gap="xs">
                            <IconMail size={16} />
                            <Text size="sm" color="dimmed">
                                employer@mail.com
                            </Text>
                        </Group>
                    </Flex>
                </Card>

                {/* Job Details */}
                <Paper shadow="md" radius="lg" p="xl" flex={1}>
                    <Flex justify="" align="center" mb="xl">
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="lg"
                            onClick={handleBack}
                            aria-label="Back to previous page"
                        >
                            <IconArrowLeft size={24} />
                        </ActionIcon>

                        <Title order={2} ml="md">
                            Job Details
                        </Title>
                    </Flex>

                    <Flex align={'center'} justify={'space-between'} gap={'md'}>
                        <Flex direction={'column'} gap={'md'}>
                            <Group>
                                <Text fw={500}>Job Title:</Text>
                                <Text>{job.title}</Text>
                            </Group>
                            <Group>
                                <Text fw={500}>Employment Type:</Text>
                                <Text>{job.type}</Text>
                            </Group>
                        </Flex>
                        <Flex direction={'column'} gap={'md'}>
                            <Group>
                                <Text fw={500}>Salary Range:</Text>
                                <Text>
                                    {job.salaryFrom.toLocaleString()} -{' '}
                                    {job.salaryTo.toLocaleString()}{' '}
                                    {job.currency}
                                </Text>
                            </Group>
                            <Group>
                                <Text fw={500}>Location:</Text>
                                <Text>{'job.location'}</Text>
                            </Group>
                        </Flex>
                    </Flex>

                    <Divider my="lg" />

                    <Stack>
                        <Text fw={600}>Full Job Description</Text>
                        <div className="job-description">
                            {parse(job.description)}
                        </div>
                    </Stack>
                </Paper>
            </Flex>
        </Container>
    );
};

export default JobDetails;

'use client';

import { useRouter } from '@/i18n/routing';
import {
    Badge,
    Box,
    Button,
    Card,
    Container,
    Grid,
    Group,
    LoadingOverlay,
    Paper,
    Stack,
    Tabs,
    Text,
    Title,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { fetchAppliedJobs } from 'app/_api/jobs/fetch-applied-jobs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface JobApplication {
    id: string;
    status: string;
    createdAt: string;
    program: {
        id: string;
        title: string;
        organization: {
            name: string;
        };
        type: string;
        experianceLevel: string;
        workPlace: string | null;
        postedDate: string | null;
    };
}

export default function MyJobsPage() {
    const t = useTranslations('my-jobs');
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string | null>('PENDING');

    const { data, isLoading } = useQuery({
        queryKey: ['applied-jobs'],
        queryFn: () =>
            fetchAppliedJobs({
                page: 1,
                limit: 10,
            }),
    });

    const applications = data || [];

    const getStatusColor = (status: string) => {
        if (status === 'PENDING') {
            return 'yellow';
        }
        if (status === 'APPROVED') {
            return 'green';
        }
        if (status === 'SHORTLISTED') {
            return 'blue';
        }
        return 'red';
    };

    const filteredApplications = applications.filter((application) => {
        if (activeTab === 'all') {
            return true;
        }
        return application.status === activeTab;
    });

    return (
        <Container size="xl" className="py-8 !h-full">
            <Stack gap="xl" h="100%">
                <Group justify="space-between" align="center">
                    <div>
                        <Title order={2}>{t('title')}</Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            {t('subtitle')}
                        </Text>
                    </div>
                    <Button
                        variant="light"
                        color="primary"
                        onClick={() => router.push('/jobs')}
                    >
                        {t('browse-jobs')}
                    </Button>
                </Group>

                <Card
                    withBorder
                    p="md"
                    className="relative min-h-[400px]"
                    radius="md"
                >
                    <LoadingOverlay
                        visible={isLoading}
                        zIndex={1000}
                        overlayProps={{ radius: 'sm', blur: 2 }}
                    />

                    <Tabs value={activeTab} onChange={setActiveTab}>
                        <Tabs.List>
                            <Tabs.Tab value="PENDING">Application</Tabs.Tab>
                            <Tabs.Tab value="SHORTLISTED">Shortlisted</Tabs.Tab>
                            <Tabs.Tab value="REJECTED">Rejected</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="PENDING" pt="md">
                            <ApplicationsList
                                applications={filteredApplications}
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="SHORTLISTED" pt="md">
                            <ApplicationsList
                                applications={filteredApplications}
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="REJECTED" pt="md">
                            <ApplicationsList
                                applications={filteredApplications}
                            />
                        </Tabs.Panel>
                    </Tabs>
                </Card>
            </Stack>
        </Container>
    );
}

function ApplicationsList({
    applications,
}: {
    applications: JobApplication[];
}) {
    const router = useRouter();

    const getStatusColor = (status: string) => {
        if (status === 'PENDING') {
            return 'yellow';
        }
        if (status === 'APPROVED') {
            return 'green';
        }
        if (status === 'SHORTLISTED') {
            return 'blue';
        }
        return 'red';
    };

    if (applications.length === 0) {
        return (
            <Box className="flex flex-col items-center justify-center h-[400px]">
                <Text size="lg" c="dimmed" ta="center">
                    No applications found
                </Text>
                <Button
                    variant="light"
                    color="primary"
                    mt="md"
                    onClick={() => router.push('/jobs')}
                >
                    Browse Jobs
                </Button>
            </Box>
        );
    }

    return (
        <Stack gap="md">
            <Grid>
                {applications.map((application) => (
                    <Grid.Col
                        span={{ base: 12, md: 6, lg: 4 }}
                        key={application.id}
                    >
                        <Paper
                            withBorder
                            p="md"
                            radius="md"
                            className="hover:shadow-md transition-shadow"
                            h={'180px'}
                        >
                            <Group justify="space-between" align="flex-start">
                                <div className="flex-1">
                                    <Group justify="space-between" mb="xs">
                                        <Title order={4}>
                                            {application.program?.title}
                                        </Title>
                                        <Badge
                                            color={getStatusColor(
                                                application.status,
                                            )}
                                        >
                                            {application.status}
                                        </Badge>
                                    </Group>
                                    <Text size="sm" c="dimmed" mb="xs">
                                        {
                                            application.program?.organization
                                                ?.name
                                        }
                                    </Text>
                                    <Group gap="xs" mb="xs">
                                        <Badge variant="light" color="blue">
                                            {application.program?.type}
                                        </Badge>
                                        <Badge variant="light" color="grape">
                                            {
                                                application.program
                                                    ?.experianceLevel
                                            }
                                        </Badge>
                                        <Badge variant="light" color="teal">
                                            {application.program?.workPlace ||
                                                'Remote'}
                                        </Badge>
                                    </Group>
                                    <Text size="sm" c="dimmed">
                                        Applied on:{' '}
                                        {application.createdAt
                                            ? new Date(
                                                  application.createdAt || '',
                                              ).toLocaleDateString()
                                            : 'N/A'}
                                    </Text>
                                </div>
                                <Button
                                    variant="light"
                                    color="primary"
                                    onClick={() =>
                                        router.push(
                                            `/jobs/${application.program?.id}`,
                                        )
                                    }
                                    size="xs"
                                >
                                    View Details
                                </Button>
                            </Group>
                        </Paper>
                    </Grid.Col>
                ))}
            </Grid>
        </Stack>
    );
}

'use client';

import { useRouter } from '@/i18n/routing';
import {
    Button,
    Card,
    Container, Group,
    LoadingOverlay, Stack,
    Tabs,
    Text,
    Title
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { fetchAppliedJobs } from 'app/_api/jobs/fetch-applied-jobs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ApplicationsList } from './_components/ApplicationList';


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
    const filteredApplications = data?.filter((application) => {
        if (activeTab === 'all') {
            return true;
        }
        return application.status === activeTab;
    }) ?? [];

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

                    <Tabs value={activeTab} onChange={setActiveTab} variant='pills'>
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


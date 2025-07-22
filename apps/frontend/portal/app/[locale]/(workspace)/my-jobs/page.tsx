'use client';

import { useRouter } from '@/i18n/routing';
import {
    Button,
    Card,
    Container,
    Group,
    Stack,
    Tabs,
    Text,
    Title,
} from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
    AppliedJobs,
    RejectedJobs,
    ShortlistedJobs,
} from './_components/ApplicationList';

export default function MyJobsPage() {
    const t = useTranslations('my-jobs');
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string | null>('PENDING');

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
                    <Tabs
                        value={activeTab}
                        onChange={setActiveTab}
                        variant="pills"
                    >
                        <Tabs.List>
                            <Tabs.Tab value="PENDING">Application</Tabs.Tab>
                            <Tabs.Tab value="SHORTLISTED">Shortlisted</Tabs.Tab>
                            <Tabs.Tab value="REJECTED">Rejected</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="PENDING" pt="md">
                            {activeTab === 'PENDING' && <AppliedJobs />}
                        </Tabs.Panel>

                        <Tabs.Panel value="SHORTLISTED" pt="md">
                            {activeTab === 'SHORTLISTED' && <ShortlistedJobs />}
                        </Tabs.Panel>

                        <Tabs.Panel value="REJECTED" pt="md">
                            {activeTab === 'REJECTED' && <RejectedJobs />}
                        </Tabs.Panel>
                    </Tabs>
                </Card>
            </Stack>
        </Container>
    );
}

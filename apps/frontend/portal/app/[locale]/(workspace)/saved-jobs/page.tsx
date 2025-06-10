'use client';

import { useRouter } from '@/i18n/routing';
import {
    Button,
    Card,
    Container, Group,
    LoadingOverlay, Stack,
    Text,
    Title
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { fetchSavedJobs } from 'app/_api/jobs/fetch-jobs';
import { useTranslations } from 'next-intl';
import { SavedJobsList } from './_components/SavedProgramsList';


export default function MyJobsPage() {
    const t = useTranslations('saved-jobs');
    const router = useRouter();
    const { data, isLoading } = useQuery({
        queryKey: ['saved-jobs'],
        queryFn: () => fetchSavedJobs(),
    });

    const applications = data?.filter(item => item != null)

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

                    <SavedJobsList applications={applications} />
                </Card>
            </Stack>
        </Container>
    );
}


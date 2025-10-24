'use client';

import { PageContainer, PageTitle } from '@/components/PageContainer';
import { Card, Group, LoadingOverlay, Stack, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { FetchTestByIdApi } from '../schema/api';

export default function TestDetailPage() {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, error } = useQuery({
        queryKey: ['test', id],
        queryFn: () => FetchTestByIdApi(id),
    });

    if (isLoading || !data) {
        return <LoadingOverlay />;
    }

    return (
        <PageContainer>
            <PageTitle>Test Detail</PageTitle>
            <Card shadow="sm" withBorder p="lg" radius="md" mt="md">
                <Stack gap="xs">
                    <Group justify="space-between">
                        <Text fw={700}>Test Name:</Text>
                        <Text>{data?.name}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={700}>Description:</Text>
                        <Text>{data?.description}</Text>
                    </Group>

                    <Group justify="space-between">
                        <Text fw={700}>Type:</Text>
                        <Text>{data?.type}</Text>
                    </Group>

                    <Group justify="space-between">
                        <Text fw={700}>Weight:</Text>
                        <Text>{data.weight}</Text>
                    </Group>

                    <Group justify="space-between">
                        <Text fw={700}>Group Assignment:</Text>
                        <Text>{data.isGroupAssignment ? 'Yes' : 'No'}</Text>
                    </Group>

                    <Group justify="space-between">
                        <Text fw={700}>Created At:</Text>
                        <Text>{new Date(data.createdAt).toLocaleString()}</Text>
                    </Group>
                </Stack>
            </Card>
        </PageContainer>
    );
}

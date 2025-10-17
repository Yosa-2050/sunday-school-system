'use client';

import { PageContainer, PageTitle } from '@/components/PageContainer';
import {
    Card,
    Group,
    LoadingOverlay,
    Paper,
    Stack,
    Tabs,
    Text,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchDepartmentById } from '../schemas/api';

export default function DepartmentDetailPage() {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, error } = useQuery({
        queryKey: ['department', id],
        queryFn: () => fetchDepartmentById(id),
    });

    if (isLoading || !data) {
        return <LoadingOverlay />;
    }

    return (
        <PageContainer>
            <PageTitle>Department Detail</PageTitle>
            {/* 🔹 Department Info Section */}
            <Card shadow="sm" withBorder p="lg" radius="md" mt="md">
                <Stack gap="xs">
                    <Group justify="space-between">
                        <Text fw={600}>Department Name:</Text>
                        <Text>{data?.name}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={600}>Status:</Text>
                        <Text c={data?.isActive ? 'green' : 'red'}>
                            {data?.isActive ? 'Active' : 'Inactive'}
                        </Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={600}>Created By:</Text>
                        <Text>{data?.createdBy}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={600}>Created At:</Text>
                        <Text>{data?.createdAt}</Text>
                    </Group>
                </Stack>
            </Card>

            {/* 🔹 Tabs for Calendar Year + Root Classes */}
            <Paper shadow="xs" p="md" mt="lg" radius="md">
                <Tabs defaultValue="calendarYears">
                    <Tabs.List>
                        <Tabs.Tab value="calendarYears">
                            Calendar Years
                        </Tabs.Tab>
                        <Tabs.Tab value="rootClasses">Root Classes</Tabs.Tab>
                        <Tabs.Tab value="users">Users</Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </Paper>
        </PageContainer>
    );
}

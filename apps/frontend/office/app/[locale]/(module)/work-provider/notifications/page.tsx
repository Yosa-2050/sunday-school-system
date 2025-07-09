'use client';

import {
    Box,
    Group,
    Loader,
    Pagination,
    ScrollArea,
    Select,
    Text,
    TextInput,
    useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';

interface NotificationItem {
    id: string;
    status: string;
    content: string;
    createdAt: string;
    deliveryStatus: string;
}

const PAGE_SIZE = 10;

export default function NotificationPage() {
    const theme = useMantineTheme();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebouncedValue(search, 300);
    const [status, setStatus] = useState<string | null>(null);

    const { data, isLoading } = {
        data: { data: [], total: 0 },
        isLoading: false,
    };

    return (
        <Box p="md">
            <Group mb="md" gap="sm" align="flex-end">
                <TextInput
                    label="Search"
                    placeholder="Search notifications..."
                    leftSection={<IconSearch size={16} />}
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    w="300"
                />

                <Select
                    label="Filter by status"
                    placeholder="All"
                    data={[
                        { label: 'Read', value: 'READ' },
                        { label: 'Pending', value: 'PENDING' },
                        { label: 'Approved', value: 'APPROVED' },
                        { label: 'Declined', value: 'DECLINED' },
                    ]}
                    clearable
                    value={status}
                    onChange={setStatus}
                    w={200}
                />
            </Group>

            <ScrollArea h={'calc(100vh - 200px)'} type="auto">
                {isLoading ? (
                    <Group justify="center" mt="md">
                        <Loader />
                    </Group>
                    // biome-ignore lint/nursery/noNestedTernary: <explanation>
                ) : data?.data?.length ? (
                    data.data.map((item: NotificationItem) => (
                        <Box key={item.id} p="md" mb="sm">
                            <Text size="sm" fw={500}>
                                {item.status}
                            </Text>
                            <Text size="sm" mt={4}>
                                {item.content}
                            </Text>
                            <Text size="xs" c="dimmed" mt={6}>
                                {new Date(item.createdAt).toLocaleString()}
                            </Text>
                        </Box>
                    ))
                ) : (
                    <Text c="dimmed" ta="center" mt="xl">
                        No notifications found.
                    </Text>
                )}
            </ScrollArea>

            <Group justify="center" mt="lg">
                <Pagination
                    total={Math.ceil((data?.total || 0) / PAGE_SIZE)}
                    value={page}
                    onChange={setPage}
                />
            </Group>
        </Box>
    );
}

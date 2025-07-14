'use client';

import {
    Divider,
    Group,
    Loader,
    Pagination,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { entityParamSerializer } from '@shega/shared';
import { IconCheck, IconSearch, IconX } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getNotificationById,
    updateNotificationById,
} from 'app/_api/notifications';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { NotificationCard } from './_components/card';
interface MyTokenPayload {
    userId: string;
}

export default function AllNotificationsPage() {
    const token = getCookie('job_access_token');
    let userId: string | undefined;

    if (typeof token === 'string') {
        const decoded = jwtDecode<MyTokenPayload>(token);
        userId = decoded.userId;
    }

    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebouncedValue(search, 300);
    const [status, setStatus] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['notifications', page, debouncedSearch, status],
        queryFn: () =>
            getNotificationById(
                entityParamSerializer({
                    f: [
                        ...(debouncedSearch
                            ? [
                                  {
                                      f: 'content',
                                      v: debouncedSearch,
                                      o: 'ilike' as const,
                                  },
                                  {
                                      f: 'subject',
                                      v: debouncedSearch,
                                      o: 'ilike' as const,
                                  },
                              ]
                            : []),
                        ...(status
                            ? [{ f: 'status', v: status, o: 'eq' as const }]
                            : []),
                    ],
                    p: page,
                    pp: 4,
                }),
            ),
        enabled: !!userId,
    });

    const mutation = useMutation({
        mutationFn: (id: string) => updateNotificationById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            notifications.show({
                title: 'Success',
                message: 'Notification marked as read',
                color: 'green',
                icon: <IconCheck size={16} />,
            });
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'Failed to mark notification as read',
                color: 'red',
                icon: <IconX size={16} />,
            });
        },
    });

    const total = data?.totalPages ?? 1;

    return (
        <Paper p={'md'} className="container mx-auto mt-4">
            <Stack>
                <Title order={2}>All Notifications</Title>

                <Group grow>
                    <TextInput
                        placeholder="Search notifications"
                        leftSection={<IconSearch size={16} />}
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                    />
                    <Select
                        placeholder="Filter by status"
                        data={[
                            { value: 'Read', label: 'Read' },
                            { value: 'Pending', label: 'Unread' },
                        ]}
                        clearable
                        value={status}
                        onChange={setStatus}
                    />
                </Group>
                <Divider />
                {(() => {
                    if (isLoading) {
                        return (
                            <Group justify="center" py="xl">
                                <Loader />
                            </Group>
                        );
                    }
                    if (data?.data?.length) {
                        return (
                            <Stack>
                                {data.data.map((notification) => (
                                    <NotificationCard
                                        key={notification.id}
                                        notification={notification}
                                        onToggleRead={() =>
                                            mutation.mutate(notification.id)
                                        }
                                    />
                                ))}
                                <Group justify="flex-end" mt="md">
                                    <Pagination
                                        value={page}
                                        onChange={setPage}
                                        total={total}
                                        hideWithOnePage
                                    />
                                </Group>
                            </Stack>
                        );
                    }
                    return (
                        <Paper p="xl" withBorder>
                            <Text ta="center">No notifications found.</Text>
                        </Paper>
                    );
                })()}
            </Stack>
        </Paper>
    );
}

'use client';

import {
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
import { IconSearch, IconX } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getNotificationById,
    unreadNotificationById,
    updateNotificationById,
} from 'app/[locale]/_api/organizations/getNotification';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import NotificationCard from '../../_components/NotificationCard';

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
        queryKey: ['notifications', userId, page, debouncedSearch, status],
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
                    pp: 10,
                }),
            ),
        enabled: !!userId,
    });

    const mutation = useMutation({
        mutationFn: (notification: { id: string; status: string }) => {
            if (notification.status.toLowerCase() === 'read') {
                return unreadNotificationById(notification.id);
            }
            return updateNotificationById(notification.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications', userId],
            });
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'Failed to update notification',
                color: 'red',
                icon: <IconX size="1.1rem" />,
            });
        },
    });

    const total = data?.totalPages ?? 1;

    return (
        <Paper p={{ base: 'sm', sm: 'md', md: 'lg' }}>
            <Stack>
                <Title order={2} fz={{ base: 'xl', sm: 'h2' }}>
                    All Notifications
                </Title>

                <Stack gap="sm">
                    <TextInput
                        placeholder="Search notifications"
                        leftSection={<IconSearch size={16} />}
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        w={{ base: '100%', sm: 'auto' }}
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
                        w={{ base: '100%', sm: 'auto' }}
                    />
                </Stack>

                {(() => {
                    if (isLoading) {
                        return (
                            <Group
                                justify="center"
                                py={{ base: 'lg', sm: 'xl' }}
                            >
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
                                            mutation.mutate(notification)
                                        }
                                    />
                                ))}
                                <Group
                                    justify="center"
                                    mt={{ base: 'md', sm: 'lg' }}
                                >
                                    <Pagination
                                        value={page}
                                        onChange={setPage}
                                        total={total}
                                        size={'xs'}
                                    />
                                </Group>
                            </Stack>
                        );
                    }
                    return (
                        <Paper
                            p={{ base: 'md', sm: 'lg', md: 'xl' }}
                            withBorder
                            ta="center"
                        >
                            <Text fz={{ base: 'sm', sm: 'md' }}>
                                No notifications found.
                            </Text>
                        </Paper>
                    );
                })()}
            </Stack>
        </Paper>
    );
}

'use client';

import {
    ActionIcon,
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
    Tooltip,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { entityParamSerializer } from '@shega/shared';
import {
    IconCircleCheck,
    IconCircleOff,
    IconMail,
    IconMailOpened,
    IconSearch,
    IconX,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getNotificationById,
    unread,
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
                    pp: 10,
                }),
            ),
        enabled: !!userId,
    });

    const markAsReadMutation = useMutation({
        mutationFn: (id: string) => updateNotificationById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
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

    const markAsUnreadMutation = useMutation({
        mutationFn: (id: string) => unread(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'Failed to mark notification as unread',
                color: 'red',
                icon: <IconX size={16} />,
            });
        },
    });

    const total = data?.totalPages ?? 1;

    return (
        <Paper p={'md'} className="container mx-auto mt-4">
            <Stack>
                <Group justify="space-between">
                    <Title order={2}>
                        <Group gap="sm">
                            <IconMail size={24} />
                            All Notifications
                        </Group>
                    </Title>
                    <Group>
                        {status === 'Read' && (
                            <Tooltip label="Showing read notifications">
                                <IconMailOpened size={20} color="gray" />
                            </Tooltip>
                        )}
                        {status === 'Pending' && (
                            <Tooltip label="Showing unread notifications">
                                <IconMail size={20} color="blue" />
                            </Tooltip>
                        )}
                    </Group>
                </Group>

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
                        leftSection={<IconMail size={16} />}
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
                                        onToggleRead={() => {
                                            if (
                                                notification.status === 'Read'
                                            ) {
                                                markAsUnreadMutation.mutate(
                                                    notification.id,
                                                );
                                            } else {
                                                markAsReadMutation.mutate(
                                                    notification.id,
                                                );
                                            }
                                        }}
                                        actionIcon={
                                            notification.status === 'Read' ? (
                                                <Tooltip label="Mark as unread">
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="gray"
                                                    >
                                                        <IconCircleOff
                                                            size={18}
                                                        />
                                                    </ActionIcon>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip label="Mark as read">
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="blue"
                                                    >
                                                        <IconCircleCheck
                                                            size={18}
                                                        />
                                                    </ActionIcon>
                                                </Tooltip>
                                            )
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
                            <Group justify="center">
                                <IconMailOpened size={24} color="gray" />
                                <Text ta="center">No notifications found.</Text>
                            </Group>
                        </Paper>
                    );
                })()}
            </Stack>
        </Paper>
    );
}

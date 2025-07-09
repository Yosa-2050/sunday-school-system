'use client';

import { Link } from '@/i18n/routing';
import {
    ActionIcon,
    Avatar,
    Box,
    Button,
    Flex,
    Group,
    Image,
    Indicator,
    Popover,
    ScrollArea,
    Text,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconBell,
    IconCalendarEvent,
    IconCheck,
    IconClipboardList,
    IconEye,
    IconEyeOff,
    IconMailOpened,
    IconX,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getNotificationById,
    updateNotificationById,
} from 'app/[locale]/_api/organizations/getNotification';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { type ReactElement, useState } from 'react';

interface MyTokenPayload {
    userId: string;
}

interface NotificationItem {
    id: string;
    icon: ReactElement;
    message: ReactElement;
    time: string;
    read: boolean;
    title: string;
    thumbnail?: string;
    avatar?: string;
}

export default function NotificationPopover() {
    const theme = useMantineTheme();
    const [opened, { toggle }] = useDisclosure(false);

    const token = getCookie('job_access_token');
    let userId: string | undefined;

    if (typeof token === 'string') {
        const decoded = jwtDecode<MyTokenPayload>(token);
        userId = decoded.userId;
    }

    const { data } = useQuery({
        queryKey: ['userId', userId],
        queryFn: () => getNotificationById(),
        enabled: !!userId,
    });

    const queryClient = useQueryClient();
    const [notificationsState, setNotificationsState] = useState<
        NotificationItem[]
    >([]);

    const mutation = useMutation({
        mutationFn: (id: string) => updateNotificationById(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['userId', userId] });
            setNotificationsState((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
            );
        },
    });

    const mapStatusToIcon = (status: string) => {
        const getColor = (color: keyof typeof theme.colors) =>
            theme.colors[color]?.[6] ?? '';
        switch (status) {
            case 'APPROVED':
                return <IconCheck size={16} color={getColor('green')} />;
            case 'DECLINED':
                return <IconX size={16} color={getColor('red')} />;
            case 'PENDING':
                return <IconMailOpened size={16} color={getColor('orange')} />;
            case 'SHORTLISTED':
                return <IconClipboardList size={16} color={getColor('blue')} />;
            case 'SCHEDULED':
                return (
                    <IconCalendarEvent size={16} color={getColor('orange')} />
                );
            default:
                return <IconMailOpened size={16} />;
        }
    };

    const notifications: NotificationItem[] =
        data?.map((item) => ({
            id: item.id,
            icon: mapStatusToIcon(item.status),
            message: <Text size="sm">{item.content}</Text>,
            time: new Date(item.createdAt).toLocaleString(),
            read: item.status.toLowerCase() === 'read',
            title: 'Notification', // Optional: or infer from content
        })) || [];

    const unreadCount = notifications.filter((n) => !n.read).length;
    const important = notifications.slice(0, 2); // example grouping
    const more = notifications.slice(2);

    const toggleRead = (id: string) => mutation.mutate(id);

    const renderList = (list: NotificationItem[]) =>
        list.map((n) => (
            <Group key={n.id} align="flex-start" wrap="nowrap" px="sm" py={8}>
                <Avatar src={n.avatar} size="sm" radius="xl" mt={4} />
                <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                        {n.title}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={2}>
                        {n.message}
                    </Text>
                    <Text size="xs" c="dimmed" mt={4}>
                        {n.time}
                    </Text>
                </Box>
                {n.thumbnail && (
                    <Image
                        src={n.thumbnail}
                        width={60}
                        height={40}
                        radius="sm"
                        fit="cover"
                    />
                )}
                <ActionIcon variant="light" onClick={() => toggleRead(n.id)}>
                    {n.read ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </ActionIcon>
            </Group>
        ));

    return (
        <Popover
            opened={opened}
            onChange={toggle}
            width={420}
            position="bottom-end"
            shadow="md"
            withArrow
            trapFocus={false}
            radius="md"
        >
            <Popover.Target>
                <Indicator
                    disabled={unreadCount === 0}
                    label={unreadCount > 99 ? '99+' : unreadCount}
                    size={16}
                    color="red"
                    offset={7}
                >
                    <ActionIcon
                        onClick={toggle}
                        variant="light"
                        size="lg"
                        radius="md"
                        aria-label="Notifications"
                    >
                        <IconBell size={18} />
                    </ActionIcon>
                </Indicator>
            </Popover.Target>

            <Popover.Dropdown p="xs">
                <ScrollArea h={400} px="xs">
                    {important.length > 0 && (
                        <Box mb="sm">
                            <Text size="sm" fw={600} mb="xs">
                                Important
                            </Text>
                            {renderList(important)}
                        </Box>
                    )}
                    {more.length > 0 && (
                        <Box>
                            <Text size="sm" fw={600} mb="xs">
                                More notifications
                            </Text>
                            {renderList(more)}
                        </Box>
                    )}
                    <Flex align={'center'} justify={'center'}>
                        <Button
                            variant="transparent"
                            component={Link}
                            href={'/work-provider/notifications'}
                        >
                            View all
                        </Button>
                    </Flex>
                </ScrollArea>
            </Popover.Dropdown>
        </Popover>
    );
}

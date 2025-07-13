'use client';

import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Button,
    Group,
    Image,
    Indicator,
    type MantineTheme,
    Popover,
    ScrollArea,
    Stack,
    Text,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { entityParamSerializer } from '@shega/shared';
import {
    IconBell,
    IconCalendarEvent,
    IconCheck,
    IconChevronRight,
    IconClipboardList,
    IconDots,
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
import { useQueryState } from 'nuqs';

interface MyTokenPayload {
    userId: string;
}

interface NotificationItem {
    id: string;
    content: string;
    createdAt: string;
    status: string;
    avatar?: string;
    thumbnail?: string;
}

export default function NotificationPopover() {
    const theme = useMantineTheme();
    const [opened, { toggle, close }] = useDisclosure(false);

    // Get user ID from JWT token
    const token = getCookie('job_access_token');
    let userId: string | undefined;

    if (typeof token === 'string') {
        const decoded = jwtDecode<MyTokenPayload>(token);
        userId = decoded.userId;
    }

    const [param] = useQueryState('notification');

    // Fetch notifications
    const { data } = useQuery({
        queryKey: ['userId', userId],
        queryFn: () =>
            getNotificationById(
                entityParamSerializer({
                    f: [{ f: 'reference', v: userId ?? '', o: 'eq' }],
                    p: 1,
                    pp: 5,
                }),
            ),
        enabled: !!userId,
    });

    const queryClient = useQueryClient();

    // Update notification mutation
    const mutation = useMutation({
        mutationFn: (id: string) => updateNotificationById(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['userId', userId] });
        },
    });

    const mapStatusToIcon = (status: string) => {
        const iconSize = 16;

        switch (status.toUpperCase()) {
            case 'APPROVED':
                return <IconCheck size={iconSize} />;
            case 'DECLINED':
                return <IconX size={iconSize} />;
            case 'PENDING':
                return <IconMailOpened size={iconSize} />;
            case 'SHORTLISTED':
                return <IconClipboardList size={iconSize} />;
            case 'SCHEDULED':
                return <IconCalendarEvent size={iconSize} />;
            default:
                return <IconMailOpened size={iconSize} />;
        }
    };

    const getStatusColor = (status: string): string => {
        switch (status.toUpperCase()) {
            case 'APPROVED':
                return 'teal';
            case 'DECLINED':
                return 'red';
            case 'PENDING':
                return 'orange';
            case 'SHORTLISTED':
                return 'blue';
            case 'SCHEDULED':
                return 'violet';
            default:
                return 'gray';
        }
    };

    const toggleRead = (id: string) => {
        mutation.mutate(id);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60),
        );

        if (diffInMinutes < 1) {
            return 'Just now';
        }
        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        }
        if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        }
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const notifications: NotificationItem[] =
        data?.data?.map((item) => ({
            id: item.id,
            content: item.content,
            createdAt: item.createdAt,
            status: item.status,
        })) || [];

    const unreadCount = notifications.filter(
        (n) => n.status.toLowerCase() !== 'read',
    ).length;

    const renderNotificationGroup = (
        notifications: NotificationItem[],
        title?: string,
    ) => (
        <Stack gap={0}>
            {title && (
                <Box px="md" py="xs" bg="gray.0">
                    <Group gap="xs">
                        <Box
                            w={8}
                            h={8}
                            bg="blue.5"
                            style={{ borderRadius: '50%' }}
                        />
                        <Text size="sm" fw={600} c="dimmed">
                            {title}
                        </Text>
                    </Group>
                </Box>
            )}

            {notifications.map((notification) => {
                const isRead = notification.status.toLowerCase() === 'read';
                const isPending =
                    notification.status.toUpperCase() === 'PENDING';

                // Extract border color logic to avoid nested ternary and handle undefined
                const getBorderColor = (theme: MantineTheme) => {
                    if (isRead) {
                        return 'transparent';
                    }
                    if (isPending) {
                        return (
                            theme.colors[theme.primaryColor]?.[3] ??
                            theme.colors.blue[5]
                        );
                    }
                    return theme.colors.blue[5];
                };

                // Extract background color logic to avoid nested ternary and handle undefined
                const getBackgroundColor = (theme: MantineTheme) => {
                    if (isRead) {
                        return theme.colors.white;
                    }
                    if (isPending) {
                        return (
                            theme.colors[theme.primaryColor]?.[0] ??
                            theme.colors.blue[0]
                        );
                    }
                    return theme.colors.blue[0];
                };

                return (
                    <Box
                        key={notification.id}
                        px="md"
                        py="sm"
                        style={(theme) => ({
                            borderLeft: `4px solid ${getBorderColor(theme)}`,
                            backgroundColor: getBackgroundColor(theme),
                            '&:hover': {
                                backgroundColor: theme.colors.gray[0],
                            },
                        })}
                    >
                        <Group align="flex-start" gap="md" wrap="nowrap">
                            <Avatar
                                src={notification.avatar}
                                size="md"
                                radius="xl"
                            >
                                {notification.content.charAt(0).toUpperCase()}
                            </Avatar>

                            <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
                                <Group gap="xs" wrap="nowrap">
                                    {mapStatusToIcon(notification.status)}
                                    <Text
                                        size="sm"
                                        fw={isRead ? 500 : 600}
                                        c={isRead ? 'dimmed' : 'dark'}
                                        truncate
                                    >
                                        Notification
                                    </Text>
                                </Group>

                                <Text
                                    size="sm"
                                    c={isRead ? 'dimmed' : 'dark.4'}
                                    lineClamp={2}
                                    lh={1.4}
                                >
                                    {notification.content}
                                </Text>

                                <Group justify="space-between" align="center">
                                    <Group gap="xs">
                                        <Badge
                                            size="xs"
                                            variant="light"
                                            color={getStatusColor(
                                                notification.status,
                                            )}
                                            fw={500}
                                        >
                                            {notification.status.toLowerCase()}
                                        </Badge>
                                        <Text size="xs" c="dimmed" fw={500}>
                                            {formatTime(notification.createdAt)}
                                        </Text>
                                    </Group>

                                    <ActionIcon
                                        variant="subtle"
                                        size="sm"
                                        color="gray"
                                        onClick={() =>
                                            toggleRead(notification.id)
                                        }
                                        loading={mutation.isPending}
                                        style={{ opacity: 0 }}
                                        className="group-hover:opacity-100"
                                    >
                                        {isRead ? (
                                            <IconEyeOff size={14} />
                                        ) : (
                                            <IconEye size={14} />
                                        )}
                                    </ActionIcon>
                                </Group>
                            </Stack>

                            {notification.thumbnail && (
                                <Image
                                    src={
                                        notification.thumbnail ||
                                        '/placeholder.svg'
                                    }
                                    w={60}
                                    h={40}
                                    radius="sm"
                                    fit="cover"
                                />
                            )}
                        </Group>
                    </Box>
                );
            })}
        </Stack>
    );

    return (
        <Popover
            opened={opened}
            onChange={toggle}
            width={420}
            position="bottom-end"
            shadow="xl"
            radius="lg"
            withArrow
            arrowSize={12}
            offset={8}
        >
            <Popover.Target>
                <Indicator
                    disabled={unreadCount === 0}
                    label={unreadCount > 99 ? '99+' : unreadCount}
                    size={20}
                    color="red"
                    offset={7}
                    processing={unreadCount > 0}
                >
                    <ActionIcon
                        onClick={toggle}
                        variant={opened ? 'filled' : 'light'}
                        size="lg"
                        radius="md"
                        aria-label="Notifications"
                    >
                        <IconBell size={18} />
                    </ActionIcon>
                </Indicator>
            </Popover.Target>

            <Popover.Dropdown p={0}>
                {/* Header */}
                <Box px="md" py="md" bg="dark" c="white">
                    <Group justify="space-between" align="center">
                        <Stack gap={2}>
                            <Text size="lg" fw={600}>
                                Notifications
                            </Text>
                            <Text size="sm" opacity={0.8}>
                                {unreadCount > 0
                                    ? `${unreadCount} unread`
                                    : 'All caught up!'}
                            </Text>
                        </Stack>

                        <Group gap="xs">
                            <ActionIcon
                                variant="subtle"
                                color="white"
                                size="sm"
                            >
                                <IconDots size={16} />
                            </ActionIcon>
                        </Group>
                    </Group>
                </Box>

                {/* Content */}
                <ScrollArea h={400} type="hover">
                    {notifications.length === 0 ? (
                        <Stack align="center" justify="center" py="xl" px="md">
                            <Box
                                w={64}
                                h={64}
                                bg="gray.1"
                                display="flex"
                                style={{
                                    borderRadius: '50%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <IconBell size={24} />
                            </Box>
                            <Stack gap="xs" align="center">
                                <Text size="lg" fw={600}>
                                    No notifications yet
                                </Text>
                                <Text
                                    size="sm"
                                    c="dimmed"
                                    ta="center"
                                    maw={280}
                                >
                                    When you get notifications, they&apos;ll
                                    show up here. Check back later!
                                </Text>
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack gap={0}>
                            {notifications.length > 0 &&
                                renderNotificationGroup(
                                    notifications,
                                    'Important',
                                )}
                        </Stack>
                    )}
                </ScrollArea>

                {/* Footer */}
                <Box px="xs" py="xs" bg="gray.0">
                    <Button
                        variant="subtle"
                        fullWidth
                        justify="center"
                        fw={500}
                        component="a"
                        href="/work-provider/notifications"
                        rightSection={<IconChevronRight size={16} />}
                    >
                        View all notifications
                    </Button>
                </Box>
            </Popover.Dropdown>
        </Popover>
    );
}

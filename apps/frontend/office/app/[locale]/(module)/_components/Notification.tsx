'use client';

import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Button,
    Drawer,
    Group,
    Image,
    Indicator,
    type MantineTheme,
    Popover,
    PopoverDropdown,
    ScrollArea,
    Stack,
    Text,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications as noti } from '@mantine/notifications';
import { entityParamSerializer } from '@shega/shared';
import {
    IconBell,
    IconCalendarEvent,
    IconCheck,
    IconChevronRight,
    IconClipboardList,
    IconEye,
    IconEyeOff,
    IconMailOpened,
    IconX,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getNotificationById,
    unreadNotificationById,
    updateNotificationById,
} from 'app/[locale]/_api/organizations/getNotification';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';

interface MyTokenPayload {
    userId: string;
}

interface NotificationItem {
    id: string;
    subject: string;
    content: string;
    createdAt: string;
    status: string;
    avatar?: string;
    thumbnail?: string;
}

export default function NotificationPopover() {
    const [activeNotificationId, setActiveNotificationId] = useState<
        string | null
    >(null);
    const [opened, { toggle, open, close }] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width: 640px)');
    const queryClient = useQueryClient();

    const token = getCookie('job_access_token');
    let userId: string | undefined;

    if (typeof token === 'string') {
        const decoded = jwtDecode<MyTokenPayload>(token);
        userId = decoded.userId;
    }

    const { data } = useQuery({
        queryKey: ['notifications', userId],
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

    const mutation = useMutation({
        mutationFn: (notification: NotificationItem) => {
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
            noti.show({
                title: 'Error',
                message: 'Failed to update notification',
                color: 'red',
                icon: <IconX size="1.1rem" />,
            });
        },
    });

    const toggleRead = (notification: NotificationItem) => {
        setActiveNotificationId(notification.id);
        mutation.mutate(notification, {
            onSettled: () => {
                setActiveNotificationId(null);
            },
        });
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

    const notifications: NotificationItem[] =
        data?.data?.map((item) => ({
            id: item.id,
            content: item.content,
            createdAt: item.createdAt,
            status: item.status,
            subject: item.subject,
        })) || [];

    const unreadCount = notifications.filter(
        (n) => n.status.toLowerCase() !== 'read',
    ).length;

    const renderNotificationGroup = (notifications: NotificationItem[]) => (
        <Stack gap={0}>
            {notifications.map((notification) => {
                const isRead = notification.status.toLowerCase() === 'read';
                const isPending =
                    notification.status.toUpperCase() === 'PENDING';

                const getBorderColor = (theme: MantineTheme) =>
                    isRead
                        ? 'transparent'
                        : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                          isPending
                          ? (theme.colors[theme.primaryColor]?.[3] ??
                            theme.colors.blue[5])
                          : theme.colors.blue[5];

                const getBackgroundColor = (theme: MantineTheme) =>
                    isRead
                        ? theme.colors.white
                        : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                          isPending
                          ? (theme.colors[theme.primaryColor]?.[0] ??
                            theme.colors.blue[0])
                          : theme.colors.blue[0];

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
                                <Text
                                    size={'xs'}
                                    fw={isRead ? 500 : 600}
                                    c={isRead ? 'dimmed' : 'dark'}
                                    truncate
                                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                                    dangerouslySetInnerHTML={{
                                        __html: notification.subject,
                                    }}
                                />
                                <Text
                                    size="xs"
                                    c={isRead ? 'dimmed' : 'dark.4'}
                                    lineClamp={2}
                                    lh={1.4}
                                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                                    dangerouslySetInnerHTML={{
                                        __html: notification.content,
                                    }}
                                />
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
                                        color="primary"
                                        onClick={() => toggleRead(notification)}
                                        loading={
                                            activeNotificationId ===
                                                notification.id &&
                                            mutation.isPending
                                        }
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
                                    src={notification.thumbnail}
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

    const notificationContent = (
        <>
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
                        <Text size="sm" c="dimmed" ta="center" maw={280}>
                            When you get notifications, they'll show up here.
                            Check back later!
                        </Text>
                    </Stack>
                </Stack>
            ) : (
                <ScrollArea h={isMobile ? '100%' : 400} type="hover">
                    {renderNotificationGroup(notifications)}
                </ScrollArea>
            )}

            <Box px="xs" py="xs" bg="gray.0">
                <Button
                    variant="subtle"
                    fullWidth
                    component="a"
                    href="/school_admin/notifications"
                    rightSection={<IconChevronRight size={16} />}
                >
                    View all notifications
                </Button>
            </Box>
        </>
    );

    return (
        <>
            <Indicator
                disabled={unreadCount === 0}
                label={unreadCount > 99 ? '99+' : unreadCount}
                size={20}
                color="red"
                offset={7}
            >
                <ActionIcon
                    onClick={open}
                    variant={opened ? 'filled' : 'light'}
                    size="lg"
                    radius="md"
                    aria-label="Notifications"
                >
                    <IconBell size={18} />
                </ActionIcon>
            </Indicator>

            {isMobile ? (
                <Drawer
                    opened={opened}
                    onClose={close}
                    position="bottom"
                    size="90%"
                    radius="lg"
                    title="Notifications"
                    padding="md"
                >
                    {notificationContent}
                </Drawer>
            ) : (
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
                    <PopoverDropdown p={0}>
                        <Box px="md" py="md" bg="primary" c="white">
                            <Stack gap={2}>
                                <Text size="lg" fw={600}>
                                    Notifications
                                </Text>
                                <Text size="sm" opacity={0.8}>
                                    {unreadCount > 0
                                        ? `${unreadCount} unread`
                                        : ''}
                                </Text>
                            </Stack>
                        </Box>
                        {notificationContent}
                    </PopoverDropdown>
                </Popover>
            )}
        </>
    );
}

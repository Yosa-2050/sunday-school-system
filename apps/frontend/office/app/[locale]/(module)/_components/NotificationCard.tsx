'use client';

import {
    ActionIcon,
    Avatar,
    Badge,
    Card,
    Group,
    Image,
    Stack,
    Text,
} from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export default function NotificationCard({
    notification,
    onToggleRead,
}: Readonly<{
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    notification: any;
    onToggleRead: () => void;
}>) {
    const isRead = notification.status?.toLowerCase() === 'read';

    const getStatusColor = (status: string): string => {
        switch (status?.toUpperCase()) {
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

    return (
        <Card p="md" withBorder radius="md">
            <Group align="flex-start">
                <Avatar>{notification.content.charAt(0)}</Avatar>
                <Stack gap="xs" style={{ flex: 1 }}>
                    <Text size="sm" fw={isRead ? 400 : 600}>
                        {notification.content}
                    </Text>
                    <Group justify="space-between">
                        <Group gap="xs">
                            <Badge
                                color={getStatusColor(notification.status)}
                                size="xs"
                                variant="light"
                            >
                                {notification.status?.toLowerCase()}
                            </Badge>
                            <Text size="xs" c="dimmed">
                                {formatTime(notification.createdAt)}
                            </Text>
                        </Group>
                        <ActionIcon
                            variant="subtle"
                            size="sm"
                            onClick={onToggleRead}
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
        </Card>
    );
}

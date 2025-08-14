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
        <Card
            //  Using responsive padding with Mantine's style props
            p={{ base: 'sm', sm: 'md' }}
            withBorder
            radius="md"
        >
            <Group
                align="flex-start"
                //  Using responsive gap
                gap={'xs'}
            >
                <Avatar
                    size="sm"
                    //  Using responsive width/height style props
                    w={{ base: 32, sm: 38 }}
                    h={{ base: 32, sm: 38 }}
                >
                    {notification.content.charAt(0)}
                </Avatar>

                <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
                    <Text
                        size="sm"
                        fw={500}
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                        dangerouslySetInnerHTML={{
                            __html: notification.subject,
                        }}
                        //  Using responsive font size
                        fz={{ base: 'sm', sm: 'md' }}
                        style={{
                            wordBreak: 'break-word',
                            lineHeight: 1.4,
                        }}
                    />

                    <Text
                        size="xs"
                        c="dimmed"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                        dangerouslySetInnerHTML={{
                            __html: notification.content,
                        }}
                        //  Using responsive font size
                        fz={{ base: 'xs', sm: 'sm' }}
                        style={{
                            wordBreak: 'break-word',
                            lineHeight: 1.4,
                        }}
                    />

                    <Group
                        justify="space-between"
                        align="center"
                        //  Using responsive gap
                        gap={'xs'}
                        wrap="wrap"
                    >
                        <Group gap="xs" style={{ minWidth: 0 }}>
                            <Badge
                                color={getStatusColor(notification.status)}
                                size="xs"
                                variant="light"
                            >
                                {notification.status?.toLowerCase()}
                            </Badge>
                            <Text
                                size="xs"
                                c="dimmed"
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                {formatTime(notification.createdAt)}
                            </Text>
                        </Group>

                        <ActionIcon
                            variant="subtle"
                            size="sm"
                            onClick={onToggleRead}
                            //  Using responsive width/height
                            w={{ base: 28, sm: 32 }}
                            h={{ base: 28, sm: 32 }}
                        >
                            {isRead ? (
                                <IconEye size={14} />
                            ) : (
                                <IconEyeOff size={14} />
                            )}
                        </ActionIcon>
                    </Group>
                </Stack>

                {notification.thumbnail && (
                    <Image
                        src={notification.thumbnail || '/placeholder.svg'}
                        //  Using responsive width/height
                        w={{ base: 50, sm: 60 }}
                        h={{ base: 35, sm: 40 }}
                        radius="sm"
                        fit="cover"
                        style={{ flexShrink: 0 }}
                    />
                )}
            </Group>
        </Card>
    );
}

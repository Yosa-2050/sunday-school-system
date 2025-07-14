'use client';

import {
    ActionIcon,
    Badge,
    Group,
    Paper,
    Stack,
    Text,
    Tooltip,
    rem,
} from '@mantine/core';
import { IconCheck, IconMail, IconMailOpened } from '@tabler/icons-react';
import type { NotificationResponse } from 'app/_api/notifications';
import { useState } from 'react';

interface NotificationCardProps {
    notification: NotificationResponse;
    onToggleRead: () => void;
}

export function NotificationCard({
    notification,
    onToggleRead,
}: NotificationCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const isRead = notification.status === 'Read';

    const formatDate = (dateString?: string) => {
        if (!dateString) {
            return 'Recently';
        }
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60),
        );

        if (diffInHours < 1) {
            return 'Just now';
        }
        if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        }
        if (diffInHours < 48) {
            return 'Yesterday';
        }
        return date.toLocaleDateString();
    };

    return (
        <Paper
            p="md"
            withBorder
            style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderLeft: `4px solid ${isRead ? 'transparent' : 'var(--mantine-color-blue-5)'}`,
                // backgroundColor: isRead ? "var(--mantine-color-gray-0)" : "var(--mantine-color-white)",
                opacity: isRead ? 0.8 : 1,
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHovered
                    ? '0 4px 12px rgba(0, 0, 0, 0.1)'
                    : '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Group align="flex-start" gap="sm" style={{ flex: 1 }}>
                    <div
                        style={{
                            marginTop: rem(2),
                        }}
                    >
                        {isRead ? (
                            <IconMailOpened size={20} />
                        ) : (
                            <IconMail size={20} />
                        )}
                    </div>

                    <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
                        <Group
                            justify="space-between"
                            align="center"
                            wrap="nowrap"
                        >
                            <Text
                                fw={isRead ? 400 : 600}
                                size="sm"
                                // c={isRead ? "dimmed" : "dark"}
                                style={{
                                    textDecoration: isRead ? 'none' : 'none',
                                    flex: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {notification.subject}
                            </Text>

                            <Group gap="xs" align="center">
                                <Badge
                                    size="xs"
                                    variant={isRead ? 'light' : 'filled'}
                                    color={isRead ? 'gray' : 'blue'}
                                    radius="sm"
                                >
                                    {isRead ? 'Read' : 'New'}
                                </Badge>

                                <Text
                                    size="xs"
                                    c="dimmed"
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {formatDate(notification.createdAt)}
                                </Text>
                            </Group>
                        </Group>

                        <Text
                            size="sm"
                            c={isRead ? 'dimmed' : 'dark'}
                            style={{
                                lineHeight: 1.4,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {notification.content}
                        </Text>
                    </Stack>
                </Group>

                <Group gap="xs" align="center">
                    {notification.status !== 'Read' && (
                        <Tooltip
                            label={isRead ? 'Mark as unread' : 'Mark as read'}
                            position="left"
                            withArrow
                        >
                            <ActionIcon
                                variant={isHovered ? 'filled' : 'subtle'}
                                color={isRead ? 'gray' : 'blue'}
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleRead();
                                }}
                                style={{
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <IconCheck size={14} />
                            </ActionIcon>
                        </Tooltip>
                    )}
                </Group>
            </Group>
        </Paper>
    );
}

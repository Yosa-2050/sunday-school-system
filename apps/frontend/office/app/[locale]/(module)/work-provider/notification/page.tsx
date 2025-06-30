import {
    ActionIcon,
    Drawer,
    Group,
    ScrollArea,
    Tabs,
    TabsList,
    TabsPanel,
    TabsTab,
    Text,
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
}

export default function NotificationDrawer() {
    const [opened, { open, close }] = useDisclosure(false);
    const token = getCookie('job_access_token');
    let userId: string | undefined;

    if (typeof token === 'string') {
        const decoded = jwtDecode<MyTokenPayload>(token);

        userId = decoded.userId;
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ['userId', userId],
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        queryFn: () => getNotificationById(userId!),
        enabled: !!userId,
    });
    const [notificationss, setNotificationss] = useState<NotificationItem[]>(
        [],
    );

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: string) => updateNotificationById(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['userId', userId] });

            setNotificationss((prev) =>
                prev.map((notif) =>
                    notif.id === id ? { ...notif, read: true } : notif,
                ),
            );
        },
    });

    const mapStatusToIcon = (status: string) => {
        switch (status) {
            case 'APPROVED':
            case 'Approved':
                return <IconCheck size={16} color="green" />;
            case 'DECLINED':
            case 'Declined':
                return <IconX size={16} color="red" />;
            case 'PENDING':
            case 'Pending':
                return <IconMailOpened size={16} color="orange" />;
            case 'SHORTLISTED':
                return <IconClipboardList size={16} color="blue" />;
            case 'SCHEDULED':
                return <IconCalendarEvent size={16} color="orange" />;
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
            read: item.deliveryStatus === 'DELIVERED',
        })) || [];

    const recentNotifications = notifications.filter((notif) => {
        const createdDate = new Date(notif.time);
        const now = new Date();
        const diffMs = now.getTime() - createdDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays <= 2;
    });

    const historyNotifications = notifications.filter((notif) => {
        const createdDate = new Date(notif.time);
        const now = new Date();
        const diffMs = now.getTime() - createdDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays > 2;
    });

    const toggleRead = (id: string, type?: string) => {
        mutation.mutate(id);
    };

    const renderList = (
        list: NotificationItem[],
        type: 'current' | 'history' = 'current',
    ) =>
        list.map((notif) => (
            <Group
                key={notif.id}
                align="flex-start"
                p="sm"
                mb="xs"
                style={{
                    background: notif.read ? '#f9fafb' : '#fff',
                    borderRadius: 8,
                    opacity: notif.read ? 0.6 : 1,
                }}
            >
                <div style={{ paddingTop: 4 }}>{notif.icon}</div>
                <div style={{ flex: 1 }}>
                    {notif.message}
                    <Text size="xs" c="dimmed" mt={2}>
                        {notif.time}
                    </Text>
                </div>
                <ActionIcon
                    variant="light"
                    onClick={() => toggleRead(notif.id, type)}
                    title={notif.read ? 'Mark as unread' : 'Mark as read'}
                >
                    {notif.read ? (
                        <IconEyeOff size={16} />
                    ) : (
                        <IconEye size={16} />
                    )}
                </ActionIcon>
                {/* <CloseButton onClick={() => {}} size="sm" /> */}
            </Group>
        ));

    return (
        <div>
            <ActionIcon
                onClick={open}
                variant="light"
                size="lg"
                radius="md"
                aria-label="Notifications"
            >
                <IconBell size={18} />
            </ActionIcon>
            <Drawer
                opened={opened}
                onClose={close}
                title="Notifications"
                position="right"
                size="md"
            >
                <Tabs defaultValue="recent">
                    <TabsList grow mb="md">
                        <TabsTab value="recent">Recent</TabsTab>
                        <TabsTab value="history">Last 30 Days</TabsTab>
                    </TabsList>

                    <TabsPanel value="recent">
                        <ScrollArea h="calc(100vh - 170px)" px="md">
                            {renderList(recentNotifications, 'current')}
                        </ScrollArea>
                    </TabsPanel>

                    <TabsPanel value="history">
                        <ScrollArea h="calc(100vh - 170px)" px="md">
                            {renderList(historyNotifications, 'history')}
                            <Text c="dimmed" mt="lg">
                                End of 30-day history.
                            </Text>
                        </ScrollArea>
                    </TabsPanel>
                </Tabs>
            </Drawer>
        </div>
    );
}

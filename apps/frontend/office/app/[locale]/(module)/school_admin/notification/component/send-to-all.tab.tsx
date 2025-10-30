import { PageContainer, PageTitle } from '@/components/PageContainer';
import { Button, Card, Group, Input, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { sendNotificationApi } from '../schemas/api';

export default function StudentDetailPage() {
    const { id } = useParams<{ id: string }>();

    const [text, setText] = useState('');

    const handleSendNotification = async () => {
        try {
            if (!text.trim()) {
                notifications.show({
                    title: 'Error',
                    message: 'Message cannot be empty',
                    color: 'red',
                });
                return;
            }

            const response = await sendNotificationApi(text);

            notifications.show({
                title: 'Success',
                message: 'Notification sent successfully',
                color: 'green',
            });
        } catch (err) {
            //add error here
        }
    };

    return (
        <PageContainer>
            <PageTitle>Student Detail</PageTitle>
            {/* 🔹 Department Info Section */}
            <Card shadow="sm" withBorder p="lg" radius="md" mt="md">
                <Stack gap="xs">
                    <Group justify="space-between">
                        <Text fw={600}>Number of students:</Text>
                        <Text />
                    </Group>
                </Stack>
            </Card>

            <PageTitle>Message</PageTitle>
            <Card shadow="sm" withBorder p="lg" radius="md" mt="md">
                <Stack gap="xs">
                    <Input
                        type="text"
                        placeholder="Type your message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </Stack>
            </Card>
            <Button onClick={handleSendNotification}>send</Button>
        </PageContainer>
    );
}

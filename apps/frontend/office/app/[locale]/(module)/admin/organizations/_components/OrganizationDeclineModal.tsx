import { Button, Group, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { fetcher } from '@shega/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next-nprogress-bar';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const DeclineModal = ({ close }: { close: () => void }) => {
    const router = useRouter();
    const [note, setNote] = useState('');
    const { id } = useParams<{ id: string }>();

    const queryClient = useQueryClient();

    const { mutateAsync: decline, isPending } = useMutation({
        mutationFn: async () => {
            const response = await fetcher(`/organization/decline/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note }),
            });
            return response;
        },
        onSuccess: () => {
            router.push('/admin/organizations');
            queryClient.invalidateQueries({ queryKey: ['organization', id] });
            notifications.show({
                title: 'Success',
                message: 'Organization has been successfully declined',
                color: 'green',
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error Declining Organization',
                message: error.message,
                color: 'red',
            });
        },
    });
    const handleDecline = () => {
        decline();
        close();
    };
    return (
        <Stack gap="md">
            <Text size="sm" c="dimmed">
                Please provide a reason for declining this organization request:
            </Text>
            <textarea
                style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    resize: 'vertical',
                }}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter decline reason..."
            />
            <Group justify="flex-end" gap="sm">
                <Button variant="outline" onClick={close}>
                    Cancel
                </Button>
                <Button color="red" loading={isPending} onClick={handleDecline}>
                    Decline Request
                </Button>
            </Group>
        </Stack>
    );
};

export { DeclineModal };

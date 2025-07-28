import { Button, Group, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { fetcher } from '@shega/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const AdjustmentModal = ({ close }: { close: () => void }) => {
    const [adjustmentNote, setAdjustmentNote] = useState('');
    const [isSubmittingAdjustment, setIsSubmittingAdjustment] = useState(false);
    const { id } = useParams<{ id: string }>();

    const queryClient = useQueryClient();
    const { mutateAsync: adjustmentFetcher, isPending } = useMutation({
        mutationFn: async () => {
            return await fetcher(`/organization/return/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ note: adjustmentNote }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organization', id],
            });

            close();
            notifications.show({
                title: 'Adjustment Requested',
                message:
                    'The organization has been successfully returned for adjustments',
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error Requesting Adjustments',
                message: error.message,
                color: 'red',
            });
        },
    });

    const handleAdjustmentSubmit = async () => {
        if (!adjustmentNote.trim()) {
            return;
        }
        await adjustmentFetcher();
    };

    return (
        <Stack gap="md">
            <Text size="sm" c="dimmed">
                Please provide details about the adjustments needed for this
                organization request:
            </Text>
            <textarea
                value={adjustmentNote}
                onChange={(e) => setAdjustmentNote(e.target.value)}
                style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    resize: 'vertical',
                }}
                placeholder="Describe the changes or adjustments needed..."
            />
            <Group justify="flex-end" gap="sm">
                <Button variant="outline" onClick={close} disabled={isPending}>
                    Cancel
                </Button>
                <Button
                    color="orange"
                    onClick={handleAdjustmentSubmit}
                    loading={isPending}
                    disabled={!adjustmentNote.trim()}
                >
                    Request Adjustments
                </Button>
            </Group>
        </Stack>
    );
};

export { AdjustmentModal };

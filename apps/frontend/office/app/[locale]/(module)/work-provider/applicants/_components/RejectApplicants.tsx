'use client';

import { Blockquote, Button, Group, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { fetcher } from '@shega/shared';
import { IconInfoCircle, IconTrash } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// API function for rejecting unshortlisted applicants
const rejectNotShortlisted = async (jobId: string) => {
    const response = await fetcher(`/job-portal/rejectNotShortList/${jobId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response;
};

interface RejectUnshortlistedSectionProps {
    jobId: string;
    infoText?: string;
    buttonText?: string;
    confirmationTitle?: string;
    confirmationText?: string;
}

export const RejectUnshortlistedSection = ({
    jobId,
    infoText = "You can reject all remaining unshortlisted applicants at once. This action will move all applicants who haven't been shortlisted to the rejected list and cannot be undone.",
    buttonText = 'Reject Unshortlisted',
    confirmationTitle = 'Confirm Rejection',
    confirmationText = 'Are you sure you want to reject all unshortlisted applicants for this job? This action cannot be undone and will move all non-shortlisted applicants to the rejected list.',
}: RejectUnshortlistedSectionProps) => {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();

    // Mutation for rejecting unshortlisted applicants
    const rejectMutation = useMutation({
        mutationFn: rejectNotShortlisted,
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message:
                    'All unshortlisted applicants have been rejected successfully',
                color: 'green',
                icon: <IconInfoCircle size={16} />,
            });

            // Invalidate relevant queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['applicants'] });
            close();
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message:
                    error.message ||
                    'Failed to reject unshortlisted applicants',
                color: 'red',
                icon: <IconInfoCircle size={16} />,
            });
            close();
        },
    });

    const handleRejectUnshortlisted = () => {
        if (jobId) {
            rejectMutation.mutate(jobId);
        }
    };

    return (
        <>
            <Blockquote color="blue" icon={<IconInfoCircle />} mb="lg">
                <Text size="sm">{infoText}</Text>
            </Blockquote>

            <Group justify="flex-end" mb="md">
                <Button
                    variant="outline"
                    color="red"
                    leftSection={<IconTrash size={16} />}
                    onClick={open}
                    disabled={!jobId}
                >
                    {buttonText}
                </Button>
            </Group>

            {/* Confirmation Modal */}
            <Modal
                opened={opened}
                onClose={close}
                title={confirmationTitle}
                centered
            >
                <Text size="sm" mb="lg">
                    {confirmationText}
                </Text>

                <Group justify="flex-end">
                    <Button variant="outline" onClick={close}>
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        onClick={handleRejectUnshortlisted}
                        loading={rejectMutation.isPending}
                    >
                        Reject All Unshortlisted
                    </Button>
                </Group>
            </Modal>
        </>
    );
};

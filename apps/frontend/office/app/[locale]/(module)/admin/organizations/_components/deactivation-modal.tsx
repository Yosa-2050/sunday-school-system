'use client';

import { Button, Group, Modal, TextInput } from '@mantine/core';

interface DeactivationModalProps {
    opened: boolean;
    onClose: () => void;
    selectedUser: { id: string; name: string } | null;
    reason: string;
    setReason: (reason: string) => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export const DeactivationModal = ({
    opened,
    onClose,
    selectedUser,
    reason,
    setReason,
    onConfirm,
    isLoading,
}: DeactivationModalProps) => {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Organization Deactivation"
            centered
        >
            <TextInput
                placeholder="Enter the reason for deactivation"
                label="Reason"
                description="Please provide a reason for deactivating this organization."
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
            <Group mt="xl" justify="flex-end">
                <Button variant="default" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    color="red"
                    loading={isLoading}
                    onClick={onConfirm}
                    disabled={!reason.trim()}
                >
                    Deactivate
                </Button>
            </Group>
        </Modal>
    );
};

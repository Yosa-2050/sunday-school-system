'use client';

import { Button, Group, Modal, Text } from '@mantine/core';

interface ActivationModalProps {
    opened: boolean;
    onClose: () => void;
    selectedUser: { id: string; name: string } | null;
    onConfirm: () => void;
    isLoading: boolean;
}

export const ActivationModal = ({
    opened,
    onClose,
    selectedUser,
    onConfirm,
    isLoading,
}: ActivationModalProps) => {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Organization Activation"
            centered
        >
            <Text>
                Are you sure you want to activate{' '}
                <Text span fw={600}>
                    {selectedUser?.name}{' '}
                </Text>
                Organization?
            </Text>
            <Group mt="xl" justify="flex-end">
                <Button variant="default" onClick={onClose}>
                    Cancel
                </Button>
                <Button loading={isLoading} onClick={onConfirm}>
                    Activate
                </Button>
            </Group>
        </Modal>
    );
};

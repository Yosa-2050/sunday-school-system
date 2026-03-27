'use client';

import { Button, Drawer, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRootClass } from 'app/[locale]/_api/admin/fetch-programs';
import { useForm } from 'react-hook-form';

export function CreateRootClass({
    programId,
    disabled,
    onCloseRefresh,
}: { programId: string; disabled?: boolean; onCloseRefresh: () => void }) {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset } = useForm();

    const handleClose = () => {
        close();
        //for refreshing the data
        onCloseRefresh();
    };

    const addRootClass = useMutation({
        mutationFn: async (data: string) => createRootClass(programId, data),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Root class created successfully!',
                color: 'green',
                icon: <IconCheck size="1.1rem" />,
            });
            reset();
            handleClose();
        },
        onError: (error: any) => {
            notifications.show({
                title: 'Error',
                message: error?.message || 'Failed to create root class',
                color: 'red',
            });
        },
    });

    return (
        <>
            <Button onClick={open} disabled={disabled}>
                + Add Root Class
            </Button>
            <Drawer
                opened={opened}
                onClose={handleClose}
                title="Create Root Class"
                position="right"
                size="md"
            >
                <form
                    onSubmit={handleSubmit((data) =>
                        addRootClass.mutate(data.text),
                    )}
                >
                    <Stack>
                        <TextInput
                            label="Name"
                            placeholder="Name"
                            {...register('text')}
                            required
                        />
                        <Button type="submit" loading={addRootClass.isPending}>
                            Create
                        </Button>
                    </Stack>
                </form>
            </Drawer>
        </>
    );
}

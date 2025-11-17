'use client';

import { Button, Drawer, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    type CreateProgram,
    createProgram,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useForm } from 'react-hook-form';

interface CreateProgramDrawerProps {
    onClose: () => void;
    organizationId: string | null;
}
export function CreateProgramDrawer({
    organizationId,
    onClose,
}: CreateProgramDrawerProps) {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset } = useForm<CreateProgram>();

    const addProgram = useMutation({
        mutationFn: async (data: CreateProgram) =>
            createProgram(data, organizationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'] });
            // queryClient.invalidateQueries({
            //   queryKey: ['rootClasses', programId],
            // });
            // queryClient.invalidateQueries({
            //   queryKey: ['program', programId, 'users'],
            // });

            notifications.show({
                title: 'Success',
                message: 'Program created successfully',
                color: 'green',
                icon: <IconCheck size="1.1rem" />,
            });

            close();
            onClose;
            reset();
        },
    });

    return (
        <>
            <Button onClick={open} disabled={!organizationId}>
                + Add Program
            </Button>
            <Drawer
                opened={opened}
                onClose={() => {
                    close;
                    onClose;
                }}
                title="Create Program"
                position="right"
                size="md"
            >
                <form
                    onSubmit={handleSubmit((data) => addProgram.mutate(data))}
                >
                    <Stack>
                        <TextInput
                            label="Program Name"
                            placeholder="Enter Program Name"
                            {...register('name')}
                            required
                        />
                        <TextInput
                            label="Description"
                            placeholder="Enter Description"
                            // {...register('description')}
                            required
                        />

                        <Button type="submit" loading={addProgram.isPending}>
                            Create
                        </Button>
                    </Stack>
                </form>
            </Drawer>
        </>
    );
}

'use client';

import { Button, Drawer, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    type CreateUserType,
    createUser,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useForm } from 'react-hook-form';

export function CreateUser({ programId }: { programId: string }) {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset } = useForm<CreateUserType>();

    const addUser = useMutation({
        mutationFn: async (data: CreateUserType) => createUser(programId, data),
        onSuccess: () => {
            // Refresh user list under program
            queryClient.invalidateQueries({
                queryKey: ['program', programId, 'users'],
            });

            notifications.show({
                title: 'Success',
                message: 'User added successfully!',
                color: 'green',
                icon: <IconCheck size="1.1rem" />,
            });

            close();
            reset();
        },
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        onError: (error: any) => {
            notifications.show({
                title: 'Error',
                message: error?.message || 'Failed to create user',
                color: 'red',
            });
        },
    });

    return (
        <>
            <Button onClick={open}>+ Add User</Button>
            <Drawer
                opened={opened}
                onClose={close}
                title="Add User"
                position="right"
                size="md"
            >
                <form onSubmit={handleSubmit((data) => addUser.mutate(data))}>
                    <Stack>
                        <TextInput
                            label="Email"
                            placeholder="user@example.com"
                            type="email"
                            {...register('email')}
                            required
                        />
                        <TextInput
                            label="First Name"
                            placeholder="First Name"
                            {...register('firstName')}
                            required
                        />
                        <TextInput
                            label="Middle Name"
                            placeholder="Middle Name"
                            {...register('middleName')}
                        />
                        <TextInput
                            label="Last Name"
                            placeholder="Last Name"
                            {...register('lastName')}
                            required
                        />
                        <Button type="submit" loading={addUser.isPending}>
                            Create
                        </Button>
                    </Stack>
                </form>
            </Drawer>
        </>
    );
}

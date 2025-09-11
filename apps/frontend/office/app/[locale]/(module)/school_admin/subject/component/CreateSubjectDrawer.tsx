'use client';

import { Button, Drawer, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { showError, showSuccess } from 'utilies/notification';
import { createSubjectApi } from '../schemas/api';
import type { CreateWithTextRequest } from '../schemas/type';

interface CreateSubjectDrawerProps {
    onCreated?: () => void;
}
export function CreateSubjectDrawer({ onCreated }: CreateSubjectDrawerProps) {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();

    const { register, control, handleSubmit, reset, setValue } =
        useForm<CreateWithTextRequest>({
            defaultValues: {
                text: '',
            },
        });

    const addSubjectMutation = useMutation({
        mutationFn: async (data: CreateWithTextRequest) =>
            createSubjectApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            showSuccess('Create Subject');
            close();
            reset();
            onCreated?.();
        },
        onError: (error) => {
            showError(error.message);
        },
    });

    return (
        <>
            <Button onClick={open}>+ Add Subject</Button>
            <Drawer
                opened={opened}
                onClose={close}
                title="Create Subject"
                position="right"
                size="md"
            >
                <form
                    onSubmit={handleSubmit((data) =>
                        addSubjectMutation.mutate(data),
                    )}
                >
                    <Stack>
                        <TextInput
                            label="Name"
                            placeholder="Subject name"
                            {...register('text')}
                            required
                        />

                        <Button
                            type="submit"
                            loading={addSubjectMutation.isPending}
                        >
                            Create
                        </Button>
                    </Stack>
                </form>
            </Drawer>
        </>
    );
}

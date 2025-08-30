'use client';

import { Button, Drawer, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    type CreateProgram,
    createCalendarYear,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useForm } from 'react-hook-form';

export function CreateCalendarYear({ programId }: { programId: string }) {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset } = useForm<CreateProgram>();

    const addCalendar = useMutation({
        mutationFn: async (data: CreateProgram) =>
            createCalendarYear(programId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['program', programId, 'calendarYears'],
            });
            queryClient.invalidateQueries({
                queryKey: ['rootClasses', programId],
            });
            queryClient.invalidateQueries({
                queryKey: ['program', programId, 'users'],
            });
            notifications.show({
                title: 'Success',
                message: 'Mentorship program published successfully',
                color: 'green',
                icon: <IconCheck size="1.1rem" />,
            });
            close();
            reset();
        },
    });

    return (
        <>
            <Button onClick={open}>+ Add Calendar Year</Button>
            <Drawer
                opened={opened}
                onClose={close}
                title="Create Calendar Year"
                position="right"
                size="md"
            >
                <form
                    onSubmit={handleSubmit((data) => addCalendar.mutate(data))}
                >
                    <Stack>
                        <TextInput
                            label="Name"
                            placeholder="Name"
                            {...register('name')}
                            required
                        />
                        <TextInput
                            type="date"
                            label="Start Date"
                            {...register('startDate')}
                            required
                        />
                        <TextInput
                            type="date"
                            label="End Date"
                            {...register('endDate')}
                            required
                        />
                        <Button type="submit" loading={addCalendar.isPending}>
                            Create
                        </Button>
                    </Stack>
                </form>
            </Drawer>
        </>
    );
}

import { Button, Drawer, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

export function CreateCalendarYear({ programId }: { programId: string }) {
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset } = useForm();

    const mutation = useMutation({
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        mutationFn: (data: any) =>
            fetch('/api/calendar-year', {
                method: 'POST',
                body: JSON.stringify({ ...data, programId }),
            }),
        onSuccess: () => {
            //queryClient.invalidateQueries(["program", programId, "calendars"]);
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
            >
                <form
                    onSubmit={handleSubmit((data) => {
                        mutation.mutate(data);
                    })}
                >
                    <Stack>
                        <TextInput
                            label="Name"
                            placeholder="2025/26"
                            {...register('name')}
                        />
                        <TextInput
                            type="date"
                            label="Start Date"
                            {...register('startDate')}
                        />
                        <TextInput
                            type="date"
                            label="End Date"
                            {...register('endDate')}
                        />
                        <Button type="submit" loading={mutation.isPending}>
                            Create
                        </Button>
                    </Stack>
                </form>
            </Drawer>
        </>
    );
}

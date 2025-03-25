import { Button, Group, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { declineJob } from 'app/[locale]/_api/admin/decline-jobs';
import { useParams, useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

interface DeclineModalProps {
    close: () => void;
}

interface FormData {
    note: string;
}

function DeclineModal({ close }: DeclineModalProps) {
    const params = useParams();
    const jobId = params.id as string;
    const router = useRouter();
    const queryClient = new QueryClient();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            note: '',
        },
        mode: 'onChange',
    });

    const { mutate: declineJobMutate, isPending: isDeclinePending } =
        useMutation({
            mutationFn: async (data: FormData) =>
                await declineJob(jobId, data.note),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['job', jobId] });
                router.push('/admin/jobs');
                notifications.show({
                    title: 'Job Decline',
                    message: 'The job has been successfully declined',
                    color: 'green',
                });
            },
            onError: (error: Error) => {
                notifications.show({
                    title: 'Error Declining Job',
                    message: error.message,
                    color: 'red',
                });
            },
        });

    const onSubmit = (data: FormData) => {
        declineJobMutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="note"
                control={control}
                rules={{
                    required: 'Decline reason is required',
                    minLength: {
                        value: 10,
                        message:
                            'Decline reason must be at least 10 characters long',
                    },
                }}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        placeholder="Enter reason for decline"
                        required
                        error={errors.note?.message}
                    />
                )}
            />
            <Group mt="md" justify="end">
                <Button
                    variant="default"
                    onClick={close}
                    loading={isDeclinePending}
                    disabled={isDeclinePending}
                >
                    Cancel
                </Button>
                <Button
                    color="red"
                    type="submit"
                    loading={isDeclinePending}
                    disabled={isDeclinePending}
                >
                    Decline
                </Button>
            </Group>
        </form>
    );
}

export default DeclineModal;

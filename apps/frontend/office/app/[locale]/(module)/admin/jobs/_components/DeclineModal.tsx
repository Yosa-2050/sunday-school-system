import { Button, Group, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { declineJob } from 'app/[locale]/_api/admin/decline-jobs';
import { useParams, useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

interface DeclineModalProps {
    close: () => void;
    programId: string;
}

interface FormData {
    note: string;
    programId?: string;
}

function DeclineModal({ close, programId }: DeclineModalProps) {
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
            mutationFn: async ({ note, programId }: FormData) => {
                if (!programId) {
                    throw new Error(
                        'Program ID is required to decline the job.',
                    );
                }
                return await declineJob(programId, note); // use programId instead of jobId
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['job', jobId] });
                router.push('/admin/jobs');
                notifications.show({
                    title: 'Job Declined',
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
        if (!programId) {
            notifications.show({
                title: 'Error',
                message: 'Program ID is not available.',
                color: 'red',
            });
            return;
        }

        declineJobMutate({
            note: data.note,
            programId,
        });
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
                    // loading={isDeclinePending}
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

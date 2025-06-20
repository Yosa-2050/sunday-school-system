import { useOrganizationDetail } from '@/hooks/organization-detail';
import { Button, Group, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

interface DeclineModalProps {
    close: () => void;
}

interface FormData {
    note: string;
}

function DeclineModal({ close }: DeclineModalProps) {
    const params = useParams();
    const id = params.id as string;
    const { declineOrganizationMutation, isDecliningOrganization } =
        useOrganizationDetail({ id });

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

    const onSubmit = (data: FormData) => {
        if (!id) {
            notifications.show({
                title: 'Error',
                message: 'Organization ID is not available.',
                color: 'red',
            });
            return;
        }

        declineOrganizationMutation(data.note);
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
                    disabled={isDecliningOrganization}
                >
                    Cancel
                </Button>
                <Button
                    color="red"
                    type="submit"
                    loading={isDecliningOrganization}
                    disabled={isDecliningOrganization}
                >
                    Decline
                </Button>
            </Group>
        </form>
    );
}

export default DeclineModal;

import {
    Button,
    Drawer,
    Group,
    Select,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    type CreateProgram,
    type IdSuccessResponse,
    type ProgramResponse,
    type SuccessResponse,
    createProgram,
    deleteProgramApi,
    updateProgramApi,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { showError, showSuccess } from 'utilities/notification';

interface CreateProgramDrawerProps {
    mode: 'create' | 'edit' | 'delete';
    program?: ProgramResponse | null;
    opened: boolean;
    onClose: () => void;
    organizationId: string | null;
    onCompleted?: () => void;
}

export function CreateProgramDrawer({
    mode,
    program,
    opened,
    organizationId,
    onClose,
    onCompleted,
}: CreateProgramDrawerProps) {
    // const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    const { control, handleSubmit, reset, setValue } = useForm<CreateProgram>({
        defaultValues: {
            name: program?.name ?? '',
            description: program?.description ?? '',
        },
    });

    useEffect(() => {
        if (opened) {
            setValue('name', program?.name ?? '');
            setValue('description', program?.description ?? '');
        }
    }, [opened, program, setValue]);

    const handleClose = () => {
        reset();
        onClose();
    };

    const mutation = useMutation<
        IdSuccessResponse | SuccessResponse,
        Error,
        CreateProgram
    >({
        mutationFn: (data: CreateProgram) => {
            if (mode === 'create') {
                return createProgram(data, organizationId);
            }
            if (!program) {
                throw new Error('No program to update');
            }
            return updateProgramApi(data, program.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'] });
            showSuccess(
                mode === 'create'
                    ? 'Program created successfully'
                    : 'Program updated successfully',
            );
            reset();
            onCompleted?.();
        },
        onError: (error: Error) => showError(error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: () => {
            if (!program) {
                throw new Error('No program selected for deletion');
            }
            return deleteProgramApi(program.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'] });
            showSuccess('program deleted successfully');
            onCompleted?.();
        },
        onError: (error: Error) => showError(error.message),
    });

    const onSubmit = (data: CreateProgram) => {
        if (mode === 'delete') {
            return;
        }
        mutation.mutate(data);
    };

    const handleDelete = () => {
        deleteMutation.mutate();
    };

    let title = '';
    if (mode === 'create') {
        title = 'Create Program';
    } else if (mode === 'edit') {
        title = 'Edit Program';
    } else {
        title = 'Delete Program';
    }

    return (
        <Drawer
            opened={opened}
            onClose={handleClose}
            title={title}
            position="right"
            size="md"
        >
            {mode === 'delete' ? (
                <Stack>
                    <Text>Are you sure you want to delete this Program?</Text>
                    <Group justify="flex-end">
                        <Button
                            color="red"
                            onClick={handleDelete}
                            loading={deleteMutation.isPending}
                        >
                            Delete
                        </Button>
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Group>
                </Stack>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack>
                        <TextInput
                            label="Program Name"
                            placeholder="Enter Program Name"
                            {...control.register('name')}
                            required
                        />
                        <TextInput
                            label="Description"
                            placeholder="Enter Description"
                            {...control.register('description')}
                            required
                        />

                        <Controller
                            name="programType"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Type"
                                    placeholder="Select Type"
                                    data={[
                                        {
                                            value: 'SS1_12',
                                            label: 'Sunday School 1 - 12',
                                        },
                                        {
                                            value: 'SS_Course',
                                            label: 'Sunday School Course',
                                        },
                                    ]}
                                    {...field}
                                />
                            )}
                        />

                        <Button type="submit" loading={mutation.isPending}>
                            {mode === 'create' ? 'Create' : 'Save Changes'}
                        </Button>
                    </Stack>
                </form>
            )}
        </Drawer>
    );
}

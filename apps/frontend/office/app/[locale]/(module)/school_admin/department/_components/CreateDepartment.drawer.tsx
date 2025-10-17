'use client';

import { Button, Drawer, Stack, TextInput } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { showError, showSuccess } from 'utilities/notification';
import { createDepartmentApi } from '../schemas/api';
import { updateDepartmentApi } from '../schemas/api';
import type { CreateDepartment, DepartmentResponse } from '../schemas/type';

interface CreateDepartmentDrawerProps {
    mode: 'create' | 'edit';
    department?: DepartmentResponse | null; // only needed for edit
    opened: boolean;
    onClose: () => void;
    onCompleted?: () => void;
}

export function CreateDepartmentDrawer({
    mode,
    department,
    opened,
    onClose,
    onCompleted,
}: CreateDepartmentDrawerProps) {
    //const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, setValue } =
        useForm<CreateDepartment>({
            defaultValues: {
                name: department?.name ?? '',
            },
        });
    const handleClose = () => {
        reset();
        onClose();
    };
    //const { register, handleSubmit, reset } = useForm<CreateDepartment>();

    useEffect(() => {
        if (opened) {
            setValue('name', department?.name ?? '');
        }
    }, [opened, department, setValue]);

    const mutation = useMutation({
        mutationFn: (data: CreateDepartment) => {
            if (mode === 'create') {
                return createDepartmentApi(data);
            }
            if (!department) {
                throw new Error('No department to update');
            }
            return updateDepartmentApi(department.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            showSuccess(
                mode === 'create' ? 'Department created' : 'Department updated',
            );
            reset();
            onCompleted?.();
        },
        onError: (error: Error) => {
            showError(error.message);
        },
    });

    return (
        <>
            <Drawer
                opened={opened}
                onClose={handleClose}
                title={mode === 'create' ? 'Create Subject' : 'Edit Subject'}
                position="right"
                size="md"
            >
                <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
                    <Stack>
                        <TextInput
                            label="Department Name"
                            placeholder="Enter Department Name"
                            {...register('name')}
                            required
                        />
                        <TextInput
                            label="Description"
                            placeholder="Enter Description"
                            // {...register('description')}
                            required
                        />

                        <Button type="submit" loading={mutation.isPending}>
                            save
                        </Button>
                    </Stack>
                </form>
            </Drawer>
        </>
    );
}

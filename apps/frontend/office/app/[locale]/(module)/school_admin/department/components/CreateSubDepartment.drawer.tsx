'use client';

import { Button, Drawer, Group, Stack, Text, TextInput } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { showError, showSuccess } from 'utilities/notification';
import {
    DeleteDepartmentApi,
    createDepartmentApi,
    updateDepartmentApi,
} from '../schemas/api';
import type { CreateDepartment, DepartmentResponse } from '../schemas/type';

interface CreateDepartmentDrawerProps {
    mode: 'create' | 'edit' | 'delete';
    department?: DepartmentResponse | null;
    editDepartment?: DepartmentResponse | null;
    opened: boolean;
    onClose: () => void;
    onCompleted?: () => void;
}

export function CreateSubDepartmentDrawer({
    mode,
    department,
    editDepartment,
    opened,
    onClose,
    onCompleted,
}: CreateDepartmentDrawerProps) {
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, setValue } =
        useForm<CreateDepartment>({
            defaultValues: {
                name: '',
                description: '',
                parentId: department?.id ?? undefined,
            },
        });

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (!opened) {
            return;
        }
        if (mode === 'edit' && department) {
            setValue('name', department.name);
            setValue('description', department.description);
        } else if (mode === 'create') {
            setValue('name', '');
            setValue('description', '');
        }
    }, [opened, department, setValue]);

    const handleClose = () => {
        reset();
        onClose();
    };

    const mutation = useMutation({
        mutationFn: (data: CreateDepartment) => {
            if (mode === 'create') {
                data.parentId = department?.id;
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
                mode === 'create'
                    ? 'Department created successfully'
                    : 'Department updated successfully',
            );
            reset();
            onCompleted?.();
        },
        onError: (error: Error) => showError(error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: () => {
            if (!department) {
                throw new Error('No department selected for deletion');
            }
            return DeleteDepartmentApi(department.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            showSuccess('Department deleted successfully');
            onCompleted?.();
        },
        onError: (error: Error) => showError(error.message),
    });

    const onSubmit = (data: CreateDepartment) => {
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
        title = 'Create Department';
    } else if (mode === 'edit') {
        title = 'Edit Department';
    } else {
        title = 'Delete Department';
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
                    <Text>
                        Are you sure you want to delete this Sub Department?
                    </Text>
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
                            label="Sub Department Name"
                            placeholder="Enter Sub Department Name"
                            {...register('name', { required: true })}
                            required
                        />

                        <TextInput
                            label="Description"
                            placeholder="Enter Description"
                            {...register('description')}
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

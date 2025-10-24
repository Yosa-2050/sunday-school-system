'use client';

import {
    Button,
    Checkbox,
    Drawer,
    Group,
    NumberInput,
    Select,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { showError, showSuccess } from 'utilities/notification';
import type { SubjectAssignmentResponse } from '../../assign_subject/schemas/type';
import { CreateTestApi, DeleteTestApi, updateTestApi } from '../schema/api';
import type { CreateTestRequest, TestResponse } from '../schema/type';

interface TestDrawerProps {
    subject?: SubjectAssignmentResponse;
    mode: 'create' | 'edit' | 'delete';
    test?: TestResponse;
    opened: boolean;
    onClose: () => void;
    onCompleted?: () => void;
}

export function TestDrawer({
    mode,
    subject,
    test,
    opened,
    onClose,
    onCompleted,
}: TestDrawerProps) {
    const queryClient = useQueryClient();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTestRequest>({
        defaultValues: {
            subjectId: test?.subjectId || '',
            name: test?.name || '',
            description: test?.description || '',
            type: test?.type || '',
            weight: test?.weight || 0,
            isGroupAssignment: test?.isGroupAssignment ?? false,
        },
    });

    useEffect(() => {
        if (opened) {
            reset({
                subjectId: test?.subjectId || '',
                name: test?.name || '',
                description: test?.description || '',
                type: test?.type || '',
                weight: test?.weight || 0,
                isGroupAssignment: test?.isGroupAssignment ?? false,
            });
        }
    }, [opened, test, reset]);

    const mutation = useMutation({
        mutationFn: async (data: CreateTestRequest) => {
            const payload = {
                subjectId: subject?.id || data.subjectId,
                name: data.name,
                description: data.description,
                type: data.type,
                weight: data.weight,
                isGroupAssignment: data.isGroupAssignment,
            };

            if (mode === 'edit') {
                if (!test?.id) {
                    throw new Error('No test found to update');
                }
                return await updateTestApi(test.id, payload);
            }

            return await CreateTestApi(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tests'] });
            showSuccess(
                mode === 'create'
                    ? 'Test created successfully'
                    : 'Test updated successfully',
            );
            reset();
            onCompleted?.();
        },
        onError: (error: Error) => {
            showError(error.message || 'Failed to save test');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => {
            if (!test) {
                throw new Error('No test selected for deletion');
            }
            return DeleteTestApi(test.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tests'] });
            showSuccess('Test deleted successfully');
            onCompleted?.();
        },
        onError: (error: Error) => {
            showError(error.message || 'Failed to delete test');
        },
    });

    const onSubmit = (data: CreateTestRequest) => {
        if (mode === 'delete') {
            return;
        }
        mutation.mutate(data);
    };

    const handleDelete = () => {
        deleteMutation.mutate();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    let title = '';
    if (mode === 'create') {
        title = 'Create Test';
    } else if (mode === 'edit') {
        title = 'Edit Test';
    } else {
        title = 'Delete Test';
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
                    <Text>Are you sure you want to delete this test?</Text>
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
                        <div className="text-sm font-medium">
                            Subject: {`${subject?.subjectTitle ?? ''}`}
                        </div>

                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Test name is required' }}
                            render={({ field }) => (
                                <TextInput
                                    label="Test Name"
                                    placeholder="Enter test name"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.name?.message}
                                    required
                                />
                            )}
                        />

                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextInput
                                    label="Description"
                                    placeholder="Enter description (optional)"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.description?.message}
                                />
                            )}
                        />

                        <Controller
                            name="type"
                            control={control}
                            rules={{ required: 'Test type is required' }}
                            render={({ field }) => (
                                <Select
                                    label="Test Type"
                                    placeholder="Select test type"
                                    data={[
                                        { value: 'Quiz', label: 'Quiz' },
                                        {
                                            value: 'Mid Exam',
                                            label: 'Mid Exam',
                                        },
                                        {
                                            value: 'Final Exam',
                                            label: 'Final Exam',
                                        },
                                        {
                                            value: 'Assignment',
                                            label: 'Assignment',
                                        },
                                    ]}
                                    value={field.value || null}
                                    onChange={field.onChange}
                                    error={errors.type?.message}
                                    required
                                />
                            )}
                        />

                        <Controller
                            name="weight"
                            control={control}
                            rules={{ required: 'Weight is required' }}
                            render={({ field }) => (
                                <NumberInput
                                    label="Weight"
                                    placeholder="Enter test weight"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.weight?.message}
                                    min={0}
                                    required
                                />
                            )}
                        />

                        <Controller
                            name="isGroupAssignment"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    label="Group Assignment?"
                                    checked={field.value}
                                    onChange={(e) =>
                                        field.onChange(e.currentTarget.checked)
                                    }
                                />
                            )}
                        />

                        <Button type="submit" loading={mutation.isPending}>
                            {mode === 'create' ? 'Create Test' : 'Save Changes'}
                        </Button>
                    </Stack>
                </form>
            )}
        </Drawer>
    );
}

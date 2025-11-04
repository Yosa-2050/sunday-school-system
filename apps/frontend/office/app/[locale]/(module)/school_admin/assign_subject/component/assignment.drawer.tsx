'use client';

import {
    Button,
    Drawer,
    Select,
    Stack,
    TextInput,
    Textarea,
} from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { showError, showSuccess } from 'utilities/notification';
import type { GetClass } from '../../classes/create/components/schema/fetchClassesDetail';
import { fetchSubjectsApi } from '../../subject/schemas/api';
import { fetchTeacherApi } from '../../teacher/schema/api';
import {
    createSubjectAssignmentApi,
    updateSubjectAssignmentApi,
} from '../schemas/api';
import type {
    CreateSubjectAssignmentRequest,
    SubjectAssignmentResponse,
} from '../schemas/type';

const TeacherType = {
    Main: 'Main',
    Sub: 'Sub',
} as const;

// Drawer Component
interface AssignmentDrawerProps {
    classes?: GetClass;
    section?: GetClass;
    mode: 'create' | 'edit';
    assignment?: SubjectAssignmentResponse | null;
    opened: boolean;
    onClose: () => void;
    onCompleted?: () => void;
}

export function AssignmentDrawer({
    mode,
    classes,
    section,
    assignment,
    opened,
    onClose,
    onCompleted,
}: AssignmentDrawerProps) {
    const queryClient = useQueryClient();
    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateSubjectAssignmentRequest>({
        defaultValues: {
            subjectId: assignment?.subjectId || '',
            classId: assignment?.classId || '',
            teacherId: assignment?.teacherId || '',
            subjectTitle: assignment?.subjectTitle || '',
            description: assignment?.description || '',
            teacherType: assignment?.teacherType || '',
            id: assignment?.id || '',
        },
    });

    const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
        queryKey: ['subjects'],
        queryFn: fetchSubjectsApi,
    });

    const { data: teachers = [], isLoading: loadingTeachers } = useQuery({
        queryKey: ['teachers'],
        queryFn: fetchTeacherApi,
    });

    // Reset form when assignment changes or drawer opens
    useEffect(() => {
        if (opened) {
            reset({
                subjectId: assignment?.subjectId || '',
                classId: assignment?.classId || '',
                teacherId: assignment?.teacherId || '',
                subjectTitle: assignment?.subjectTitle || '',
                description: assignment?.description || '',
                teacherType: assignment?.teacherType || '',
                id: assignment?.id || '',
            });
        }
    }, [opened, assignment, reset]);

    const mutation = useMutation({
        mutationFn:
            mode === 'create'
                ? createSubjectAssignmentApi
                : updateSubjectAssignmentApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjectAssignments'] });
            showSuccess(
                mode === 'create' ? 'Assignment created' : 'Assignment updated',
            );
            reset();
            onCompleted?.();
        },
        onError: (error: Error) => {
            showError(error.message);
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = (data: CreateSubjectAssignmentRequest) => {
        data.classId = section?.id ?? classes?.id;
        if (mode === 'edit' && assignment?.id) {
            data.id = assignment.id;
        }
        mutation.mutate(data);
    };

    return (
        <Drawer
            opened={opened}
            onClose={handleClose}
            title={
                mode === 'create'
                    ? 'Create Subject Assignment'
                    : 'Edit Subject Assignment'
            }
            position="right"
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
                    Class: {`${classes?.name} ${section ? section?.name : ''}`}
                    <Controller
                        name="subjectId"
                        control={control}
                        rules={{ required: 'Subject is required' }}
                        render={({ field }) => (
                            <Select
                                label="Subject"
                                placeholder="Select subject"
                                data={subjects.map((s) => ({
                                    value: s.id,
                                    label: s.name,
                                }))}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.subjectId?.message}
                                required
                                disabled={loadingSubjects}
                            />
                        )}
                    />
                    <Controller
                        name="subjectTitle"
                        control={control}
                        rules={{ required: 'Subject title is required' }}
                        render={({ field }) => (
                            <TextInput
                                label="Subject Title"
                                placeholder="Enter subject title"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.subjectTitle?.message}
                                required
                            />
                        )}
                    />
                    <Controller
                        name="teacherId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Teacher (Optional)"
                                placeholder="Select teacher"
                                data={teachers.map((t) => ({
                                    value: t.id,
                                    label: `${t.firstName} ${t.lastName}`,
                                }))}
                                value={field.value || null}
                                onChange={field.onChange}
                                disabled={loadingTeachers}
                                clearable
                            />
                        )}
                    />
                    {/* Teacher Type - Only enabled when teacher is selected */}
                    <Controller
                        name="teacherType"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Teacher Type"
                                placeholder="Select teacher type"
                                data={Object.entries(TeacherType).map(
                                    ([key, value]) => ({
                                        value: key,
                                        label: value,
                                    }),
                                )}
                                value={field.value || null}
                                onChange={field.onChange}
                                disabled={
                                    !watch('teacherId') || loadingTeachers
                                }
                                clearable
                            />
                        )}
                    />
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Textarea
                                label="Description (Optional)"
                                placeholder="Enter description"
                                value={field.value || ''}
                                onChange={field.onChange}
                                autosize
                                minRows={3}
                            />
                        )}
                    />
                    <Button type="submit" loading={mutation.isPending}>
                        {mode === 'create' ? 'Create' : 'Save'}
                    </Button>
                </Stack>
            </form>
        </Drawer>
    );
}

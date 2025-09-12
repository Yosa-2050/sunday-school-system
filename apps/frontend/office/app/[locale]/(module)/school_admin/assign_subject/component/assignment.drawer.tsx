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
import { showError, showSuccess } from 'utilies/notification';
import { fetchSubjectsApi } from '../../subject/schemas/api';
import { fetchTeacherApi } from '../../teacher/schema/api';
import { createSubjectAssignmentApi } from '../schemas/api';
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
    classId: string;
    className: string;
    mode: 'create' | 'edit';
    assignment?: SubjectAssignmentResponse | null;
    opened: boolean;
    onClose: () => void;
    onCompleted?: () => void;
}

export function AssignmentDrawer({
    mode,
    classId,
    className,
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
            classId: classId || '',
            teacherId: assignment?.teacherId || '',
            subjectTitle: assignment?.subjectTitle || '',
            description: assignment?.description || '',
            teacherType: assignment?.teacherType || '',
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

    const selectedTeacherId = watch('teacherId');

    // // Set teacher type when teacher is selected
    // useEffect(() => {
    //     if (selectedTeacherId) {
    //         const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);
    //         if (selectedTeacher?.teacherType) {
    //             setValue('teacherType', selectedTeacher.teacherType);
    //         }
    //     } else {
    //         setValue('teacherType', '');
    //     }
    // }, [selectedTeacherId, teachers, setValue]);

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
            });
        }
    }, [opened, assignment, reset]);

    const mutation = useMutation({
        mutationFn: createSubjectAssignmentApi,
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
                    Class: {className}
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
                    {/* {watch('teacherType') && (
                        <Text size="sm">
                            Teacher Type: {TeacherType[watch('teacherType') as TeacherTypeKey] || watch('teacherType')}
                        </Text>
                    )} */}
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

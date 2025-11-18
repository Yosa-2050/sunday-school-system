'use client';

import { Button, Drawer, Stack, TextInput } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { showError, showSuccess } from 'utilities/notification';
import { createSubjectApi, updateSubjectApi } from '../schemas/api';
import type {
    CreateWithTextRequest,
    GetSubjectResponse,
} from '../schemas/type';

interface SubjectDrawerProps {
    programId: string | '';
    mode: 'create' | 'edit';
    subject?: GetSubjectResponse | null; // only needed for edit
    opened: boolean;
    onClose: () => void;
    onCompleted?: () => void;
}

export function SubjectDrawer({
    programId,
    mode,
    subject,
    opened,
    onClose,
    onCompleted,
}: SubjectDrawerProps) {
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, setValue } =
        useForm<CreateWithTextRequest>({
            defaultValues: {
                text: subject?.name ?? '',
            },
        });

    // Reset form when subject changes or drawer opens
    useEffect(() => {
        if (opened) {
            setValue('text', subject?.name ?? '');
        }
    }, [opened, subject, setValue]);

    const mutation = useMutation({
        mutationFn: (data: CreateWithTextRequest) => {
            if (mode === 'create') {
                return createSubjectApi(data, programId);
            }
            if (!subject) {
                throw new Error('No subject to update');
            }
            return updateSubjectApi(subject.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
            showSuccess(
                mode === 'create' ? 'Subject created' : 'Subject updated',
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

    return (
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
                        label="Name"
                        placeholder="Subject name"
                        {...register('text')}
                        required
                    />

                    <Button type="submit" loading={mutation.isPending}>
                        {mode === 'create' ? 'Create' : 'Save'}
                    </Button>
                </Stack>
            </form>
        </Drawer>
    );
}

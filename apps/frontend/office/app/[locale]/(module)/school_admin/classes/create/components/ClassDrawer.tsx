'use client';

import {
    ActionIcon,
    Button,
    Drawer,
    Group,
    Select,
    Stack,
    TextInput,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    type ProgramResponse,
    fetchRootClassesSchoolAdmin,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { showError, showSuccess } from 'utilities/notification';
import {
    type CreateClass,
    type GetClass,
    createClass,
    updateClass,
} from './schema/fetchClassesDetail';

interface ClassDrawerProps {
    opened: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    programId: string | null;
    calendarId: string | null;
    selectedClass?: GetClass | null;
}

export function ClassDrawer({
    opened,
    programId,
    mode,
    calendarId,
    selectedClass,
    onClose,
}: ClassDrawerProps) {
    // const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    const [classes, setClasses] = useState<ProgramResponse[]>([]);

    const { register, control, handleSubmit, reset, setValue } =
        useForm<CreateClass>({
            defaultValues: {
                name: '',
                description: '',
                rootId: '',
                section: [],
            },
        });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'section',
    });

    useEffect(() => {
        const getClasses = async () => {
            try {
                // setLoadingYears(true);
                const data: ProgramResponse[] =
                    await fetchRootClassesSchoolAdmin(programId ?? '');
                setClasses(data);
            } catch (err) {
                //console.error('Failed to fetch calendar years', err);
            } finally {
                // setLoadingYears(false);
            }
        };

        getClasses();
    }, [programId]);

    useEffect(() => {
        if (mode === 'edit' && selectedClass) {
            reset({
                name: selectedClass.name,
                description: selectedClass.description ?? '',
                rootId: selectedClass.root.id,
                section:
                    selectedClass.sections?.map((s) => ({
                        name: s.name,
                    })) ?? [],
            });
        }

        if (mode === 'create') {
            reset({
                name: '',
                description: '',
                rootId: '',
                section: [],
            });
        }
    }, [mode, selectedClass, reset]);

    const addClassMutation = useMutation({
        mutationFn: (data: CreateClass) => {
            if (mode === 'edit' && selectedClass) {
                return updateClass(selectedClass.id, {
                    ...data,
                });
            }
            return createClass(data, calendarId ?? '');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });

            showSuccess(
                mode === 'create'
                    ? 'Class created successfully'
                    : 'Class updated successfully',
            );

            onClose();
            reset();
        },
        onError: () => {
            showError(
                mode === 'create'
                    ? 'Failed to create class'
                    : 'Failed to update class',
            );
        },
    });

    return (
        <>
            {/* <Button onClick={open}>+ Add Class</Button> */}
            <Drawer
                opened={opened}
                onClose={onClose}
                // title="Create Class"
                title={mode === 'create' ? 'Create Class' : 'Edit Class'}
                position="right"
                size="md"
            >
                <form
                    onSubmit={handleSubmit((data) =>
                        addClassMutation.mutate(data),
                    )}
                >
                    <Stack>
                        <TextInput
                            label="Name"
                            placeholder="Class name"
                            {...register('name')}
                            required
                        />
                        <TextInput
                            label="Description"
                            placeholder="Class description"
                            {...register('description')}
                        />
                        {/* Root ID Select */}
                        <Select
                            label="Root Class"
                            data={
                                classes?.map(
                                    (r: { id: string; name: string }) => ({
                                        value: r.id,
                                        label: r.name,
                                    }),
                                ) ?? []
                            }
                            onChange={(val) => setValue('rootId', val || '')}
                            required
                        />

                        {/* Sections */}
                        <Group justify="space-between">
                            <h4>Sections:</h4>
                            <Button
                                leftSection={<IconPlus size={16} />}
                                onClick={() => append({ name: '' })}
                                variant="light"
                                size="xs"
                                type="button"
                            >
                                Add Section
                            </Button>
                        </Group>

                        {fields.map((field, index) => (
                            <Group key={field.id} justify="space-between">
                                <TextInput
                                    placeholder={`Section ${index + 1}`}
                                    {...register(`section.${index}` as const)}
                                    style={{ flex: 1 }}
                                />
                                <ActionIcon
                                    color="red"
                                    onClick={() => remove(index)}
                                    variant="light"
                                >
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Group>
                        ))}

                        <Button
                            type="submit"
                            loading={addClassMutation.isPending}
                        >
                            {mode === 'create' ? 'Create' : 'Update'}
                        </Button>
                    </Stack>
                </form>
            </Drawer>
        </>
    );
}

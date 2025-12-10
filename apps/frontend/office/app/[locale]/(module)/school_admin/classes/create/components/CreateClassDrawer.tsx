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
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconPlus, IconTrash } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    type ProgramResponse,
    fetchRootClassesSchoolAdmin,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { type CreateClass, createClass } from './schema/fetchClassesDetail';

interface CreateClassDrawerProps {
    onClose: () => void;
    programId: string | null;
    calendarId: string | null;
}

export function CreateClassDrawer({
    programId,
    calendarId,
    onClose,
}: CreateClassDrawerProps) {
    const [opened, { open, close }] = useDisclosure(false);
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

    const addClassMutation = useMutation({
        mutationFn: async (data: CreateClass) =>
            createClass(data, calendarId ?? ''),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            notifications.show({
                title: 'Success',
                message: 'Class created successfully',
                color: 'green',
                icon: <IconCheck size="1.1rem" />,
            });
            close();
            reset();
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to save attendance',
                color: 'red',
            });
        },
    });

    return (
        <>
            <Button onClick={open}>+ Add Class</Button>
            <Drawer
                opened={opened}
                onClose={close}
                title="Create Class"
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
                            // placeholder={
                            //     rootsLoading
                            //         ? 'Loading...'
                            //         : 'Select root class'
                            // }
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
                            <h4>Sections</h4>
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
                            Create
                        </Button>
                    </Stack>
                </form>
            </Drawer>
        </>
    );
}

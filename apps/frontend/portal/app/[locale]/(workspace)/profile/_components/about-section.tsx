'use client';

import { aboutSchema } from '@/lib/schemas';
import type { About } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ActionIcon,
    Box,
    Button,
    Card,
    Divider,
    Group,
    Stack,
    Text,
    Textarea,
    Title,
    rem,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconCheck,
    IconDeviceFloppy,
    IconPencil,
    IconPlus,
    IconX,
} from '@tabler/icons-react';
import { useUpdateBio } from 'app/_api/profile/queries';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface AboutSectionProps {
    data: About;
    onUpdate: (data: About) => void;
}

export default function AboutSection({ data, onUpdate }: AboutSectionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const { mutate: updateBio } = useUpdateBio();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<About>({
        resolver: zodResolver(aboutSchema),
        defaultValues: data,
    });

    const onSubmit = async (values: About) => {
        setIsEditing(true);
        try {
            await updateBio(values.bio, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'Cover letter updated successfully',
                        color: 'green',
                        icon: <IconCheck size={16} />,
                    });
                },
                onError: (error) => {
                    notifications.show({
                        title: 'Error',
                        message:
                            error instanceof Error
                                ? error.message
                                : 'Failed to update cover letter',
                        color: 'red',
                        icon: <IconX size={16} />,
                    });
                },
            });
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <Card shadow="sm" withBorder>
            <Stack gap="md">
                <Group justify="space-between">
                    <Title order={4}>About</Title>
                    {(() => {
                        if (isEditing) {
                            return (
                                <Group>
                                    <Button
                                        leftSection={<IconX size={16} />}
                                        variant="light"
                                        color="red"
                                        size="sm"
                                        onClick={() => {
                                            reset(data);
                                            setIsEditing(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        leftSection={
                                            <IconDeviceFloppy size={16} />
                                        }
                                        variant="light"
                                        color="blue"
                                        size="sm"
                                        onClick={handleSubmit(onSubmit)}
                                    >
                                        Save
                                    </Button>
                                </Group>
                            );
                        }

                        if (data.bio) {
                            return (
                                <Button
                                    leftSection={<IconPencil size={16} />}
                                    variant="light"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </Button>
                            );
                        }

                        return (
                            <ActionIcon
                                variant="light"
                                color="blue"
                                size="lg"
                                radius="xl"
                                onClick={() => setIsEditing(true)}
                                aria-label="Add experience"
                            >
                                <IconPlus size={18} />
                            </ActionIcon>
                        );
                    })()}
                </Group>

                <Divider />

                {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Textarea
                            placeholder="Tell us about yourself..."
                            minRows={5}
                            autosize
                            {...register('bio')}
                            error={errors.bio?.message}
                        />
                    </form>
                ) : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                data.bio ? (
                    <>
                        <Text
                            style={{ whiteSpace: 'pre-wrap' }}
                            className={
                                data.bio.length > 200 && !expanded
                                    ? 'line-clamp-4'
                                    : ''
                            }
                        >
                            {data.bio}
                        </Text>
                        {data.bio.length > 200 && (
                            <Box mt="xs">
                                <Text
                                    component="a"
                                    href="#"
                                    size="sm"
                                    c="blue"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setExpanded(!expanded);
                                    }}
                                >
                                    {expanded ? 'Show less' : 'Read more'}
                                </Text>
                            </Box>
                        )}
                    </>
                ) : (
                    <Box
                        p="xl"
                        style={{
                            borderRadius: rem(8),
                            //   backgroundColor: "var(--mantine-color-gray-0)",
                        }}
                    >
                        <Text c="dimmed" ta="center" fs="italic">
                            No bio provided. Click edit to add your bio.
                        </Text>
                    </Box>
                )}
            </Stack>
        </Card>
    );
}

'use client';

import { personalInfoSchema } from '@/lib/schemas';
import type { PersonalInfo } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import type { Profile } from '@/models/job-seeker.type';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    Card,
    Divider,
    Grid,
    Group,
    Loader,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
    IconCalendar,
    IconDeviceFloppy,
    IconPencil,
    IconPhone,
    IconUser,
    IconX,
} from '@tabler/icons-react';
import { useTitles } from 'app/_api/profile/location';
import { useUpdateProfile } from 'app/_api/profile/queries';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface PersonalInfoSectionProps {
    data: Profile;
    onUpdate: (data: PersonalInfo) => void;
}

export default function PersonalInfoSection({
    data,
    onUpdate,
}: Readonly<PersonalInfoSectionProps>) {
    const [isEditing, setIsEditing] = useState(false);
    const { mutate: updateProfile } = useUpdateProfile(data?.id || '');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: data,
    });

    const { data: titles, isFetching } = useTitles();

    const onSubmit = (formData: Partial<PersonalInfo>) => {
        updateProfile(formData);
        setIsEditing(false);
    };

    return (
        <Card shadow="sm" withBorder radius="md">
            <Stack gap="md">
                <Group justify="space-between">
                    <Title order={4} fw={600}>
                        Personal Information
                    </Title>
                    {isEditing ? (
                        <Group>
                            <Button
                                leftSection={<IconX size={16} />}
                                variant="light"
                                color="red"
                                size="sm"
                                radius="xl"
                                onClick={() => {
                                    reset(data);
                                    setIsEditing(false);
                                }}
                                style={{
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                leftSection={<IconDeviceFloppy size={16} />}
                                variant="filled"
                                color="blue"
                                size="sm"
                                radius="xl"
                                onClick={handleSubmit((data) =>
                                    onSubmit({
                                        ...data,
                                        id: '',
                                    }),
                                )}
                                style={{
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    },
                                }}
                            >
                                Save
                            </Button>
                        </Group>
                    ) : (
                        <Button
                            leftSection={<IconPencil size={16} />}
                            variant="light"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            radius="xl"
                            style={{
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                },
                            }}
                        >
                            Edit
                        </Button>
                    )}
                </Group>

                <Divider />
                {isEditing ? (
                    <form
                        onSubmit={handleSubmit((data) =>
                            onSubmit({
                                ...data,
                            }),
                        )}
                    >
                        <Stack gap="xl">
                            <Grid>
                                <Grid.Col span={{ base: 12, md: 12 }}>
                                    <Stack gap="lg">
                                        <Group grow>
                                            <TextInput
                                                label="First Name"
                                                placeholder="Enter your first name"
                                                readOnly
                                                size="md"
                                                styles={{
                                                    input: {
                                                        '&:focus': {
                                                            boxShadow:
                                                                '0 0 0 3px rgba(34,139,230,0.1)',
                                                        },
                                                    },
                                                    label: {
                                                        marginBottom: '8px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 500,
                                                    },
                                                }}
                                                {...register('firstName')}
                                                error={
                                                    errors.firstName?.message
                                                }
                                            />

                                            <TextInput
                                                label="Last Name"
                                                placeholder="Enter your last name"
                                                size="md"
                                                readOnly
                                                styles={{
                                                    input: {
                                                        '&:focus': {
                                                            boxShadow:
                                                                '0 0 0 3px rgba(34,139,230,0.1)',
                                                        },
                                                    },
                                                    label: {
                                                        marginBottom: '8px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 500,
                                                    },
                                                }}
                                                {...register('lastName')}
                                                error={errors.lastName?.message}
                                            />
                                        </Group>

                                        <Group grow>
                                            <TextInput
                                                label="Middle Name"
                                                placeholder="Enter your middle name"
                                                readOnly
                                                size="md"
                                                styles={{
                                                    input: {
                                                        '&:focus': {
                                                            boxShadow:
                                                                '0 0 0 3px rgba(34,139,230,0.1)',
                                                        },
                                                    },
                                                    label: {
                                                        marginBottom: '8px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 500,
                                                    },
                                                }}
                                                {...register('middleName')}
                                                error={
                                                    errors.middleName?.message
                                                }
                                            />

                                            <TextInput
                                                label="Phone Number"
                                                placeholder="Enter your phone number"
                                                size="md"
                                                styles={{
                                                    input: {
                                                        '&:focus': {
                                                            boxShadow:
                                                                '0 0 0 3px rgba(34,139,230,0.1)',
                                                        },
                                                    },
                                                    label: {
                                                        marginBottom: '8px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 500,
                                                    },
                                                }}
                                                {...register('phoneNumber')}
                                                error={
                                                    errors.phoneNumber?.message
                                                }
                                            />
                                        </Group>

                                        <Group grow>
                                            <Controller
                                                name="birthDate"
                                                control={control}
                                                render={({ field }) => {
                                                    // Max date = today's date minus 18 years
                                                    const maxDate = new Date();
                                                    maxDate.setFullYear(
                                                        maxDate.getFullYear() -
                                                            18,
                                                    );

                                                    return (
                                                        <DateInput
                                                            label="Birth Date"
                                                            placeholder="Select your birth date"
                                                            size="md"
                                                            hideOutsideDates
                                                            maxDate={maxDate}
                                                            styles={{
                                                                input: {
                                                                    '&:focus': {
                                                                        boxShadow:
                                                                            '0 0 0 3px rgba(34,139,230,0.1)',
                                                                    },
                                                                },
                                                                label: {
                                                                    marginBottom:
                                                                        '8px',
                                                                    fontSize:
                                                                        '0.9rem',
                                                                    fontWeight: 500,
                                                                },
                                                            }}
                                                            value={
                                                                field.value
                                                                    ? new Date(
                                                                          field.value,
                                                                      )
                                                                    : maxDate
                                                            }
                                                            onChange={(value) =>
                                                                field.onChange(
                                                                    value?.toISOString(),
                                                                )
                                                            }
                                                        />
                                                    );
                                                }}
                                            />

                                            <Controller
                                                name="gender"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        label="Gender"
                                                        placeholder="Select your gender"
                                                        size="md"
                                                        styles={{
                                                            input: {
                                                                '&:focus': {
                                                                    boxShadow:
                                                                        '0 0 0 3px rgba(34,139,230,0.1)',
                                                                },
                                                            },
                                                            label: {
                                                                marginBottom:
                                                                    '8px',
                                                                fontSize:
                                                                    '0.9rem',
                                                                fontWeight: 500,
                                                            },
                                                        }}
                                                        data={[
                                                            {
                                                                value: 'FEMALE',
                                                                label: 'Female',
                                                            },
                                                            {
                                                                value: 'MALE',
                                                                label: 'Male',
                                                            },
                                                        ]}
                                                        {...field}
                                                        error={
                                                            errors.gender
                                                                ?.message
                                                        }
                                                    />
                                                )}
                                            />
                                        </Group>

                                        <Controller
                                            name="title"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    label="Title"
                                                    placeholder={
                                                        isFetching
                                                            ? 'Loading...'
                                                            : 'Select your title'
                                                    }
                                                    rightSection={
                                                        isFetching ? (
                                                            <Loader size="xs" />
                                                        ) : null
                                                    }
                                                    size="md"
                                                    styles={{
                                                        input: {
                                                            '&:focus': {
                                                                boxShadow:
                                                                    '0 0 0 3px rgba(34,139,230,0.1)',
                                                            },
                                                        },
                                                        label: {
                                                            marginBottom: '8px',
                                                            fontSize: '0.9rem',
                                                            fontWeight: 500,
                                                        },
                                                    }}
                                                    data={
                                                        titles?.map(
                                                            (title) => ({
                                                                label: title.value,
                                                                value: title.key,
                                                            }),
                                                        ) ?? []
                                                    }
                                                    {...field}
                                                    error={
                                                        errors.title?.message
                                                    }
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    </form>
                ) : (
                    <Stack gap="md">
                        <Group>
                            <Stack gap="lg" w="100%">
                                <Group justify="space-between">
                                    <Text
                                        fw={700}
                                        size="xl"
                                        style={{ letterSpacing: '-0.5px' }}
                                    >
                                        {data.firstName} {data.lastName}
                                    </Text>
                                    <Box
                                        px="md"
                                        py="xs"
                                        bg="blue.1"
                                        style={{ borderRadius: '8px' }}
                                    >
                                        <Text size="sm" c="blue.7" fw={500}>
                                            {data.title ?? 'Not set'}
                                        </Text>
                                    </Box>
                                </Group>

                                <Stack gap="xs">
                                    <Group gap="xl">
                                        <Group gap="xs">
                                            <Box c="gray.6">
                                                <IconUser size={16} />
                                            </Box>
                                            <Text c="dimmed" size="sm">
                                                {data.gender ?? 'Not set'}
                                            </Text>
                                        </Group>

                                        <Group gap="xs">
                                            <Box c="gray.6">
                                                <IconCalendar size={16} />
                                            </Box>
                                            <Text c="dimmed" size="sm">
                                                {data.birthDate
                                                    ? formatDate(data.birthDate)
                                                    : 'Not set'}
                                            </Text>
                                        </Group>

                                        <Group gap="xs">
                                            <Box c="gray.6">
                                                <IconPhone size={16} />
                                            </Box>
                                            <Text c="dimmed" size="sm">
                                                {data.phoneNumber
                                                    ? data.phoneNumber
                                                    : 'Not set'}
                                            </Text>
                                        </Group>
                                    </Group>
                                </Stack>
                            </Stack>
                        </Group>
                    </Stack>
                )}
            </Stack>
        </Card>
    );
}

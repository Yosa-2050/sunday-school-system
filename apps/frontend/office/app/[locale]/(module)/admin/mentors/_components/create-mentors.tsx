'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
    Button,
    Drawer,
    Flex,
    Group,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconXboxX } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    type CreateMentorsProps,
    createMentors,
} from 'app/[locale]/_api/mentors/create-mentorship';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export function CreateMentors() {
    const [opened, { open, close }] = useDisclosure(false);
    const t = useTranslations('createMentors');

    const mentorsSchema = z.object({
        firstName: z.string().min(1, t('validation.firstNameRequired')),
        middleName: z.string().min(1, t('validation.middleNameRequired')),
        lastName: z.string().min(1, t('validation.lastNameRequired')),
        email: z
            .string()
            .min(1, t('validation.emailRequired'))
            .email(t('validation.invalidEmail'))
            .nonempty(t('validation.emailRequired')),
    });

    const queryClient = useQueryClient();

    // Initialize react-hook-form with validation schema
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(mentorsSchema),
    });

    // Create user mutation
    const createUserMutation = useMutation({
        mutationFn: createMentors,
        mutationKey: ['mentors'],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mentors'] });
            notifications.show({
                title: t('notifications.successTitle'),
                message: t('notifications.successMessage'),
            });
            close();
            reset();
        },
        onError: (error) => {
            notifications.show({
                title: t('notifications.errorTitle'),
                color: 'red',
                message: 'Email already exists!',
            });
        },
    });

    const onSubmit = (data: CreateMentorsProps) => {
        createUserMutation.mutate({ ...data });
    };

    return (
        <>
            <Drawer
                opened={opened}
                onClose={close}
                title={
                    <Text className="text-primary font-bold text-xl mb-4">
                        {t('createUserTitle')}
                    </Text>
                }
                size="md"
                position="right"
                closeButtonProps={{
                    icon: <IconXboxX size={20} stroke={1.5} />,
                }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack gap="sm">
                        <TextInput
                            label={t('firstNameLabel')}
                            placeholder={t('firstNamePlaceholder')}
                            {...register('firstName')}
                            error={errors.firstName?.message}
                            withAsterisk
                        />
                        <Flex justify="space-between" gap={'xs'}>
                            <TextInput
                                label={t('middleNameLabel')}
                                placeholder={t('middleNamePlaceholder')}
                                {...register('middleName')}
                                error={errors.middleName?.message}
                                withAsterisk
                            />
                            <TextInput
                                label={t('lastNameLabel')}
                                placeholder={t('lastNamePlaceholder')}
                                {...register('lastName')}
                                error={errors.lastName?.message}
                                withAsterisk
                            />
                        </Flex>
                        <TextInput
                            label={t('emailLabel')}
                            placeholder={t('emailPlaceholder')}
                            {...register('email')}
                            error={errors.email?.message}
                            withAsterisk
                            styles={{
                                input: {
                                    borderColor: 'rgba(204, 204, 204, 1)',
                                    '&:focus, &:focus-within': {
                                        borderColor: 'rgba(19, 158, 123, 1)',
                                        outline: 'none',
                                        boxShadow:
                                            '0 0 0 1px rgba(19, 158, 123, 1)',
                                    },
                                },
                            }}
                        />

                        <Group justify="flex-end" mt="md" w={'100%'}>
                            <Button
                                type="submit"
                                loading={createUserMutation.isPending}
                                disabled={createUserMutation.isPending}
                                w={'100%'}
                            >
                                {'Create Mentor'}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Drawer>

            <Button onClick={open}>{'Create Mentor'}</Button>
        </>
    );
}

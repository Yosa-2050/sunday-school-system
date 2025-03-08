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
import { logger } from '@shega/shared';
import { IconXboxX } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateOrganizations } from 'app/[locale]/_api/organizations/create-organizations';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export function CreateOrganization() {
    const [opened, { open, close }] = useDisclosure(false);
    const t = useTranslations('createOrganizations');

    const organizationSchema = z.object({
        firstName: z.string().min(1, t('validation.firstNameRequired')),
        middleName: z.string().min(1, t('validation.middleNameRequired')),
        lastName: z.string().min(1, t('validation.lastNameRequired')),
        email: z.string().email(t('validation.invalidEmail')),
        organizationName: z
            .string()
            .min(1, t('validation.companyNameRequired')),
    });

    const queryClient = useQueryClient();

    // Initialize react-hook-form with validation schema
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        resolver: zodResolver(organizationSchema),
    });

    // Create user mutation
    const createUserMutation = useMutation({
        mutationFn: CreateOrganizations,
        mutationKey: ['organizations'],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
            notifications.show({
                title: t('notifications.successTitle'),
                message: t('notifications.successMessage'),
            });
            close();
        },
        onError: (error) => {
            logger.log(error);
            notifications.show({
                title: t('notifications.errorTitle'),
                message: `${t('notifications.errorMessage')} ${error.message}`,
            });
        },
    });

    const onSubmit = (data: Omit<CreateOrganizations, 'role'>) => {
        createUserMutation.mutate({ ...data, role: 'WORK_PROVIDER' });
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

                        <TextInput
                            label={t('companyNameLabel')}
                            placeholder={t('companyNamePlaceholder')}
                            {...register('organizationName')}
                            error={errors.organizationName?.message}
                            withAsterisk
                        />

                        <Group justify="flex-end" mt="md" w={'100%'}>
                            <Button
                                type="submit"
                                loading={createUserMutation.isPending}
                                disabled={createUserMutation.isPending}
                                w={'100%'}
                            >
                                {'Create Organization'}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Drawer>

            <Button onClick={open}>{'Create Organization'}</Button>
        </>
    );
}

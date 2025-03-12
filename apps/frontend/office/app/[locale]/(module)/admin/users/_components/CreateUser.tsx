import { zodResolver } from '@hookform/resolvers/zod';
import {
    Button,
    Drawer,
    Flex,
    Group,
    Select,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { logger } from '@shega/shared';
import { IconPlus, IconXboxX } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    type CreateUsers,
    createUsers,
} from 'app/[locale]/_api/users/create-users';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

export function CreateUser() {
    const [opened, { open, close }] = useDisclosure(false);
    const t = useTranslations('crateUsers');

    const userSchema = z.object({
      role: z.string().min(1, t("validation.roleRequired")),
      firstName: z.string().min(1, t("validation.firstNameRequired")),
      middleName: z.string().min(1, t("validation.middleNameRequired")),
      lastName: z.string().min(1, t("validation.lastNameRequired")),
      email: z
        .string()
        .min(1, t("validation.emailRequired"))
        .email(t("validation.invalidEmail"))
        .nonempty(t("validation.emailRequired")),
    });
    const queryClient = useQueryClient();

    // Initialize react-hook-form with validation schema
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<CreateUsers>({
        resolver: zodResolver(userSchema),
    });

    // Create user mutation
    const createUserMutation = useMutation({
        mutationFn: createUsers,
        mutationKey: ['users'],
        onSuccess: () => {
            notifications.show({
                title: t('notifications.successTitle'),
                message: t('notifications.successMessage'),
            });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            close();
            reset(); // Reset form data to default after success
        },
        onError: (error) => {
            logger.log(error);
            notifications.show({
                title: t('notifications.errorTitle'),
                message: `${t('notifications.errorMessage')}`,
                color: 'red',
            });
        },
    });

    const role = watch('role');

    const onSubmit = (data: CreateUsers) => {
        createUserMutation.mutate(data);
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
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label={t('roleLabel')}
                                    placeholder={t('rolePlaceholder')}
                                    data={[
                                        {
                                            value: 'JOB_SEEKER',
                                            label: t('roles.jobSeeker'),
                                        },
                                        {
                                            value: 'ADMINISTRATOR',
                                            label: t('roles.administrator'),
                                        },
                                    ]}
                                    error={errors.role?.message}
                                    withAsterisk
                                />
                            )}
                        />
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
                                {t('createUserButton')}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Drawer>

            <Button leftSection={<IconPlus size={18} />} onClick={open}>
                {t('createUserButton')}
            </Button>
        </>
    );
}

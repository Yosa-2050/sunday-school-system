'use client';

import { useRouter } from '@/i18n/routing';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Anchor,
    Box,
    Button,
    Flex,
    Group,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    COOKIE_ACCESS_TOKEN,
    COOKIE_REFRESH_TOKEN,
    logger,
} from '@shega/shared';
import { useAuth } from '@shega/ui';
import { useMutation } from '@tanstack/react-query';
import { login } from 'app/[locale]/_api/auth/login';
import { getUserAction } from 'app/[locale]/_api/get-user-action';
import { setCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format')
        .regex(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email format',
        ),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
});

const Login = () => {
    const { setUser } = useAuth();
    const router = useRouter();
    const t = useTranslations('auth.login');
    const [rememberMe, setRememberMe] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    const loginMutation = useMutation({
        mutationFn: login,
        onError: () => {
            notifications.show({
                title: 'Error',
                message: t('loginFailed'),
                color: 'red',
            });
        },
        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
        onSuccess: async ({ data }) => {
            try {
                if (data.pwdChangeRequired) {
                    router.push(`/auth/change-password/${data.id}`);
                } else {
                    logger.log(data);

                    setCookie('organization_id', data?.details?.organizationId);
                    const user = await getUserAction(data.access_token);
                    if (!user) {
                        notifications.show({
                            title: 'Error',
                            message: t('loginFailed'),
                            color: 'red',
                        });
                    }
                    if (user) {
                        setUser({
                            ...user,
                            role: data.role as
                                | 'administrator'
                                | 'work_provider',
                            id: user.id ?? '',
                            createdBy: user.createdBy ?? '',
                        });
                        if (data.role === 'administrator') {
                            router.push('/admin/dashboard');
                        } else if (data.role === 'work_provider') {
                            router.push('/work-provider/jobs');
                        } else if (data.role === 'super_admin') {
                            router.push('/admin/dashboard');
                        }
                        setCookie('role', data.role);
                        setCookie(COOKIE_ACCESS_TOKEN, data.access_token, {
                            maxAge: rememberMe ? 7 * 24 * 60 * 60 : undefined,
                        });
                        setCookie(COOKIE_REFRESH_TOKEN, data.access_token, {
                            httpOnly: true,
                            secure: true,
                            maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined,
                        });
                    }
                }
            } catch (error) {
                logger.error('Error processing login success:', error);
            }
        },
    });

    const onSubmit = (values: { email: string; password: string }) => {
        loginMutation.mutateAsync({
            username: values.email,
            password: values.password,
            origin: 'office',
        });
    };

    return (
        <Box className="flex items-center justify-center bg-white shadow rounded w-full md:w-1/2">
            <div className="relative w-full p-8">
                <Flex direction={'column'} align="center">
                    <Title className="text-xl text-start">{t('title')}</Title>
                    <Text ta="start" className="mb-3 text-gray-500 text-sm">
                        {t('subtitle')}
                    </Text>
                </Flex>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack gap="md">
                        <TextInput
                            label={t('emailLabel')}
                            placeholder={t('emailPlaceholder')}
                            {...register('email')}
                            error={errors.email?.message}
                        />
                        <PasswordInput
                            label={t('passwordLabel')}
                            placeholder={t('passwordPlaceholder')}
                            {...register('password')}
                            error={errors.password?.message}
                        />
                        <Group justify="flex-end" mt={'sm'}>
                            {/* <Checkbox
                title="Remember me"  
                label={t("rememberMe")}
                className="text-teal-600"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              /> */}
                            <Anchor
                                size="sm"
                                onClick={() =>
                                    router.push('/auth/forgot-password')
                                }
                                className="text-sm text-teal-600 hover:underline"
                            >
                                {t('forgotPassword')}
                            </Anchor>
                        </Group>
                        <Button
                            type="submit"
                            fullWidth
                            className="w-full rounded-md px-4 py-2 text-white"
                            loading={loginMutation.isPending}
                        >
                            {t('loginButton')}
                        </Button>
                    </Stack>
                </form>
            </div>
        </Box>
    );
};

export default Login;

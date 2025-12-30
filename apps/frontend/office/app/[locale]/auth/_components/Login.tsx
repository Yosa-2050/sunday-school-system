'use client';

import { useRouter } from '@/i18n/routing';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Anchor,
    Box,
    Button,
    Flex,
    Group,
    Modal,
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
import { type Data, login } from 'app/[locale]/_api/auth/login';
import { getUserAction } from 'app/[locale]/_api/get-user-action';
import { setCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import { RoleEnum } from 'node_modules/@shega/shared/src/types/role';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

type LoginFormValues = {
    email: string;
    password: string;
};

const Login = () => {
    const router = useRouter();
    const { setUser } = useAuth();
    const t = useTranslations('auth.login');

    const [roleModalOpened, setRoleModalOpened] = useState(false);
    const [availableRoles, setAvailableRoles] = useState<RoleEnum[]>([]);
    const [pendingLogin, setPendingLogin] = useState<LoginFormValues | null>(
        null,
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(schema),
    });

    /* ---------------------------------- utils --------------------------------- */

    const redirectByRole = (role: RoleEnum) => {
        switch (role) {
            case RoleEnum.teacher:
                router.push('/teacher/dashboard');
                break;
            case RoleEnum.home_room:
                router.push('/home_room/dashboard');
                break;
            case RoleEnum.school_admin:
                router.push('/school_admin/dashboard');
                break;
            case RoleEnum.administrator:
            case RoleEnum.super_admin:
                router.push('/admin/dashboard');
                break;
        }
    };

    const updateCookies = (data: Data) => {
        setCookie(COOKIE_ACCESS_TOKEN, data.access_token);
        setCookie(COOKIE_REFRESH_TOKEN, data.access_token, {
            httpOnly: true,
            secure: true,
        });
        setCookie('role', data.role);
        setCookie('organization_id', data.details?.organizationId);
    };

    const finalizeLogin = async (data: Data) => {
        const user = await getUserAction(data.access_token);
        if (!user) {
            notifications.show({
                title: 'Error',
                message: t('loginFailed'),
                color: 'red',
            });
            return;
        }

        setUser({
            ...user,
            role: data.role,
            id: user.id,
            createdBy: user.createdBy,
        });

        updateCookies(data);
        redirectByRole(data.role);
    };

    /* ------------------------------- mutations -------------------------------- */

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: async ({ data }) => {
            try {
                if (data.pwdChangeRequired) {
                    router.push(`/auth/change-password/${data.id}`);
                    return;
                }

                // MULTI ROLE FLOW
                if (data.selectRole && data.allRoles?.length) {
                    setAvailableRoles(data.allRoles);
                    setRoleModalOpened(true);
                    return;
                }

                // SINGLE ROLE FLOW
                await finalizeLogin(data);
            } catch (err) {
                logger.error(err);
            }
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: t('loginFailed'),
                color: 'red',
            });
        },
    });

    /* ------------------------------- handlers ---------------------------------- */

    const onSubmit = (values: LoginFormValues) => {
        setPendingLogin(values);

        loginMutation.mutate({
            username: values.email,
            password: values.password,
            origin: 'office',
        });
    };

    const handleRoleSelect = (role: RoleEnum) => {
        if (!pendingLogin) {
            return;
        }

        loginMutation.mutate({
            username: pendingLogin.email,
            password: pendingLogin.password,
            role, // 🔥 send selected role
            origin: 'office',
        });

        setRoleModalOpened(false);
    };

    /* ---------------------------------- UI ------------------------------------ */

    return (
        <Box className="flex items-center justify-center bg-white shadow rounded w-full md:w-1/2">
            <div className="relative w-full p-8">
                <Flex direction="column" align="center">
                    <Title>{t('title')}</Title>
                    <Text c="dimmed">{t('subtitle')}</Text>
                </Flex>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack>
                        <TextInput
                            label={t('emailLabel')}
                            {...register('email')}
                            error={errors.email?.message}
                        />

                        <PasswordInput
                            label={t('passwordLabel')}
                            {...register('password')}
                            error={errors.password?.message}
                        />

                        <Group justify="flex-end">
                            <Anchor
                                size="sm"
                                onClick={() =>
                                    router.push('/auth/forgot-password')
                                }
                            >
                                {t('forgotPassword')}
                            </Anchor>
                        </Group>

                        <Button type="submit" loading={loginMutation.isPending}>
                            {t('loginButton')}
                        </Button>
                    </Stack>
                </form>
            </div>

            <Modal
                opened={roleModalOpened}
                onClose={() => {
                    '';
                }}
                closeOnEscape={false}
                closeOnClickOutside={false}
                title="Select role"
                centered
            >
                <Stack>
                    {availableRoles.map((role) => (
                        <Button
                            key={role}
                            variant="light"
                            onClick={() => handleRoleSelect(role)}
                        >
                            {role.replace('_', ' ').toUpperCase()}
                        </Button>
                    ))}
                </Stack>
            </Modal>
        </Box>
    );
};

export default Login;

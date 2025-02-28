"use client";

import { useRouter } from "@/i18n/routing";
import {
    Alert,
    Anchor,
    Box,
    Button,
    Card,
    Checkbox,
    Group,
    PasswordInput,
    Stack,
    TextInput,
    Title,
    Text
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { login } from 'app/[locale]/_api/auth/login';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const t = useTranslations('auth.login');
    const loginMutation = useMutation({
        mutationFn: login,
        onError: (err) => {
            notifications.show({
                title: 'Error',
                message: err.message,
                color: 'red',
            }); 
        },
        onSuccess: () => {
            router.push('/dashboard');
        },
    });
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
       await loginMutation.mutateAsync({ username, password });
    };

  return (
    <Box className="flex h-screen items-center justify-center bg-white">
      <div className="absolute top-4 left-4">
        <img src="./logos.PNG" className="h-10" alt="Shega Jobs Logo" />
      </div>
      <div className="relative w-full max-w-xl  bg-white p-8">
        <Stack>
          <Title className="text-xl text-start">{t("title")}</Title>
          <Text ta="start" className="mb-3 text-gray-500 text-sm">
            {t("subtitle")}
          </Text>

                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput
                                label={t('usernameLabel')}
                                placeholder={t('usernamePlaceholder')}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <PasswordInput
                                label={t('passwordLabel')}
                                placeholder={t('passwordPlaceholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Group justify="space-between" mt={'xl'}>
                                <Checkbox
                                    title="Remember me"
                                    label={t('rememberMe')}
                                />
                                <Anchor
                                    size="sm"
                                    onClick={() =>
                                        router.push('/auth/forgot-password')
                                    }
                                    className="cursor-pointer"
                                >
                                    {t('forgotPassword')}
                                </Anchor>
                            </Group>
                            <Button type="submit" fullWidth className="mt-auto">
                                {t('loginButton')}
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </div>
        </Box>
    );
};

export default Login;

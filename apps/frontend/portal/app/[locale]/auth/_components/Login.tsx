'use client';

import { useRouter } from '@/i18n/routing';
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
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const t = useTranslations('auth.login');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || t('loginFailed'));
            }

            router.push('/dashboard');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <Box className="flex items-center justify-center min-h-screen w-full bg-gray-100 p-4">
            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                className="w-full max-w-md bg-white"
            >
                <Stack>
                    <Title ta="center">{t('title')}</Title>

                    {error && (
                        <Alert
                            icon={<IconAlertCircle size={16} />}
                            color="red"
                            mb="md"
                        >
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput
                                label={t('emailLabel')}
                                placeholder={t('emailPlaceholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
            </Card>
        </Box>
    );
};

export default Login;

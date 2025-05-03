import { useRouter } from '@/i18n/routing';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Anchor,
    Button,
    Card,
    Container,
    Group,
    Paper,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from 'app/_api/auth/reset-password';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const forgetPasswordSchema = z.object({
    username: z
        .string()
        .email({ message: 'Please enter a valid email address' }),
});

type ForgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>;

export default function ForgetPassword() {
    const t = useTranslations('auth');
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ForgetPasswordFormValues>({
        resolver: zodResolver(forgetPasswordSchema),
        defaultValues: {
            username: '',
        },
    });

    const mutation = useMutation<
        { success: true },
        Error,
        ForgetPasswordFormValues
    >({
        mutationFn: (data) => resetPassword(data),
        onSuccess: (data) => {
            router.push({
                pathname: '/auth/otp',
                query: { username: watch('username') },
            });
            notifications.show({
                title: 'Reset Password Request',
                color: 'green',
                message:
                    'Your password reset request is successful. Check your email for the Verification Code(OTP)',
            });
        },
        onError: () => {
            notifications.show({
                title: 'Reset Password Request',
                color: 'red',
                message: 'The email address you entered is not registered.',
            });
        },
    });

    const onSubmit = (data: ForgetPasswordFormValues) => {
        mutation.mutate(data);
    };

    return (
        <Container size={'sm'} my={40}>
            <Card>
                <Title ta="center">{t('forgotPassword.title')}</Title>
                <Text color="dimmed" size="sm" ta="center" mt={5}>
                    {t('forgotPassword.subtitle')}
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextInput
                            label={t('forgotPassword.emailLabel')}
                            placeholder={t('forgotPassword.emailPlaceholder')}
                            required
                            error={
                                errors.username ? errors.username.message : null
                            }
                            {...register('username')}
                        />

                        <Group justify="space-between" mt="lg">
                            <Anchor href="/auth/login" size="sm">
                                {t('forgotPassword.backToLogin')}
                            </Anchor>
                        </Group>

                        <Button
                            fullWidth
                            mt="xl"
                            type="submit"
                            loading={mutation.isPending}
                        >
                            {t('forgotPassword.sendResetLink')}
                        </Button>
                    </form>
                </Paper>
            </Card>
        </Container>
    );
}

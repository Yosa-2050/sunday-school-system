import { Container, Paper, Title, Text, TextInput, Button, Group, Anchor } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

const forgetPasswordSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>;

export default function ForgetPassword() {
    const t = useTranslations('auth');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgetPasswordFormValues>({
        resolver: zodResolver(forgetPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const mutation = useMutation<ForgetPasswordFormValues, Error, ForgetPasswordFormValues>({
        mutationFn: async (data: ForgetPasswordFormValues) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return data;
        },
    });

    const onSubmit = (data: ForgetPasswordFormValues) => {
        mutation.mutate(data);
    };

    return (
        <Container size={420} my={40}>
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
                        error={errors.email ? errors.email.message : null}
                        {...register('email')}
                    />

                    <Group justify="space-between" mt="lg">
                        <Anchor href="/auth/login" size="sm">
                            {t('forgotPassword.backToLogin')}
                        </Anchor>
                    </Group>

                    <Button fullWidth mt="xl" type="submit" loading={mutation.isPending}>
                        {t('forgotPassword.sendResetLink')}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

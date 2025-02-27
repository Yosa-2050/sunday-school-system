'use client';

import { Box, Button, Card, Group, PasswordInput, Stack, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { notifications } from '@mantine/notifications';

const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
        newPassword: z
            .string()
            .min(8, 'New password must be at least 8 characters')
            .regex(/[A-Z]/, 'Must include at least one uppercase letter')
            .regex(/[a-z]/, 'Must include at least one lowercase letter')
            .regex(/[0-9]/, 'Must include at least one number')
            .regex(/[^A-Za-z0-9]/, 'Must include at least one special character'),
        confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
    });

    const newPasswordValue = watch('newPassword', '');
    const confirmPasswordValue = watch('confirmPassword', '');

    const { mutate, isPending, error, isSuccess } = useMutation<unknown, Error, ChangePasswordFormValues>({
        mutationFn: async (data: ChangePasswordFormValues) => {
            const response = await fetch('/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to change password');
            }
            return response.json();
        },
        onError: (error) => {
            notifications.show({
                title: 'Failed to change password',
                message: error.message,
                color: 'red',
            });
        },
        onSuccess: () => {
            notifications.show({
                title: 'Password changed successfully',
                message: 'Your password has been updated',
                color: 'green',
            });
        }
    });

    const onSubmit = (data: ChangePasswordFormValues) => {
        mutate(data, {
            onSuccess: () => {
                reset();
            },
        });
    };

    const isButtonDisabled = !(newPasswordValue && confirmPasswordValue);

    return (
        <Box className="flex items-center justify-center min-h-screen w-full bg-gray-100 p-4">
            <Card shadow="sm" padding="lg" radius="md" className="w-full max-w-md bg-white">
                <Stack>
                    <Title order={2} ta="center" mb={"lg"}>Change Password</Title>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack>
                            <PasswordInput
                                label="Current Password"
                                placeholder="Enter your current password"
                                {...register('currentPassword')}
                                error={errors.currentPassword?.message}
                            />
                            <PasswordInput
                                label="New Password"
                                placeholder="Enter a new password"
                                {...register('newPassword')}
                                error={errors.newPassword?.message}
                            />
                            <PasswordInput
                                label="Confirm New Password"
                                placeholder="Confirm your new password"
                                {...register('confirmPassword')}
                                error={errors.confirmPassword?.message}
                            />
                            <Group w={'100%'} justify="center" mt={'lg'}>
                                <Button type="submit" loading={isPending} disabled={isButtonDisabled} className='w-full'>
                                    Change Password
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Stack>
            </Card>
        </Box>
    );
};

export default ChangePassword;

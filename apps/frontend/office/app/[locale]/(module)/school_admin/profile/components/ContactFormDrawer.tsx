'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Drawer, Group, Select, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconDeviceFloppy,
    IconMail,
    IconPhone,
    IconX,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitContactPerson } from 'app/[locale]/_api/submit-contact-person';
import { getCookie } from 'cookies-next';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const contactSchema = z.object({
    employeeOrgId: z.string().optional(),
    contactPersonName: z.string().min(1, 'Full name is required'),
    contactPersonRole: z.string().min(1, 'Role is required'),
    contactPersonPhone: z.string().min(1, 'Phone number is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
});

export type ContactFormData = z.infer<typeof contactSchema> & { id?: string };

interface ContactFormDrawerProps {
    opened: boolean;
    onClose: () => void;
    initialType: string | null;
    setInitialType: (value: string | null) => void;
    defaultValues?: Partial<ContactFormData> | null;
}

export function ContactFormDrawer({
    opened,
    onClose,
    initialType,
    setInitialType,
    defaultValues,
}: Readonly<ContactFormDrawerProps>) {
    const queryClient = useQueryClient();
    const organization_id = getCookie('organization_id')?.toString();

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            employeeOrgId: defaultValues?.employeeOrgId || '',
            contactPersonName: defaultValues?.contactPersonName || '',
            contactPersonRole: defaultValues?.contactPersonRole || '',
            contactPersonPhone: defaultValues?.contactPersonPhone || '',
            email: defaultValues?.email || '',
        },
    });

    const { mutateAsync, isPending: loading } = useMutation({
        mutationFn: async (formData: ContactFormData) => {
            const [firstNameRaw, middleName = '', lastName = ''] =
                formData.contactPersonName.trim().split(' ');
            const firstName = firstNameRaw || '';

            const payload = {
                phoneNumber: formData.contactPersonPhone,
                firstName,
                middleName,
                lastName,
                email: formData.email,
                employeeOrgId:
                    formData.employeeOrgId ??
                    defaultValues?.employeeOrgId ??
                    '',
                position: formData.contactPersonRole,
            };

            return (await submitContactPerson({ ...payload })) as any;
        },

        onSuccess: (res: { reference: string }) => {
            queryClient.invalidateQueries({
                queryKey: ['organization_id', organization_id],
            });
            queryClient.invalidateQueries({
                queryKey: ['can_organization_submit'],
            });
            reset();
            notifications.show({
                title: 'Saved',
                message: 'Contact info saved successfully',
                color: 'green',
            });
            onClose();
        },

        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'Something went wrong while saving',
                color: 'red',
                icon: <IconX size={16} />,
            });
        },
    });

    const onSubmit = async (data: ContactFormData) => {
        await mutateAsync(data);
    };

    useEffect(() => {
        if (defaultValues) {
            setValue(
                'contactPersonName',
                defaultValues.contactPersonName || '',
            );
            setValue(
                'contactPersonRole',
                defaultValues.contactPersonRole || '',
            );
            setValue(
                'contactPersonPhone',
                defaultValues.contactPersonPhone || '',
            );
            setValue('email', defaultValues.email || '');
            setValue('employeeOrgId', defaultValues.employeeOrgId || '');
        }
    }, [defaultValues, setValue]);

    return (
        <Drawer
            opened={opened}
            onClose={() => {
                onClose();
                reset();
                setInitialType(null);
            }}
            title="Add Employee"
            position="right"
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
                    <Controller
                        control={control}
                        name="contactPersonRole"
                        render={({ field }) => (
                            <Select
                                label="Position"
                                data={[
                                    'Administrator',
                                    'ContactPerson',
                                    'HiringManager',
                                ]}
                                withAsterisk
                                defaultValue={initialType}
                                value={field.value}
                                onChange={(value) => {
                                    setInitialType(value);
                                    setValue('contactPersonRole', value || '');
                                }}
                                error={errors.contactPersonRole?.message}
                                placeholder="Select position"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="contactPersonName"
                        render={({ field }) => (
                            <TextInput
                                label="Full Name"
                                withAsterisk
                                placeholder="Enter full name"
                                {...field}
                                error={errors.contactPersonName?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="contactPersonPhone"
                        render={({ field }) => (
                            <TextInput
                                label="Phone Number"
                                withAsterisk
                                placeholder="+251..."
                                leftSection={<IconPhone size={16} />}
                                {...field}
                                error={errors.contactPersonPhone?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <TextInput
                                label="Corporate Email"
                                withAsterisk
                                placeholder="email@company.com"
                                leftSection={<IconMail size={16} />}
                                {...field}
                                error={errors.email?.message}
                            />
                        )}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={loading}
                            leftSection={<IconDeviceFloppy size={16} />}
                        >
                            Save
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Drawer>
    );
}

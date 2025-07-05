// app/[locale]/_components/ContactFormDrawer.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Drawer, Group, Select, Stack, TextInput } from '@mantine/core';
import { IconDeviceFloppy, IconMail, IconPhone } from '@tabler/icons-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const contactSchema = z.object({
    contactPersonName: z.string().min(1, 'Full name is required'),
    contactPersonRole: z.string().min(1, 'Role is required'),
    contactPersonPhone: z.string().min(1, 'Phone number is required'),
    contactPersonEmail: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email')
        .refine((email) => {
            const domain = email.split('@')[1];
            return (
                domain &&
                ![
                    'gmail.com',
                    'yahoo.com',
                    'hotmail.com',
                    'outlook.com',
                ].includes(domain.toLowerCase())
            );
        }, 'Use a corporate email'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormDrawerProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: ContactFormData) => Promise<void>;
    loading: boolean;
    initialType: string | null;
    setInitialType: (value: string | null) => void;
    defaultValues?: Partial<ContactFormData> | null;
}

export function ContactFormDrawer({
    opened,
    onClose,
    onSubmit,
    loading,
    initialType,
    setInitialType,
    defaultValues,
}: ContactFormDrawerProps) {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            contactPersonName: defaultValues?.contactPersonName || '',
            contactPersonRole: defaultValues?.contactPersonRole || '',
            contactPersonPhone: defaultValues?.contactPersonPhone || '',
            contactPersonEmail: defaultValues?.contactPersonEmail || '',
        },
    });

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
            setValue(
                'contactPersonEmail',
                defaultValues.contactPersonEmail || '',
            );
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
            title="Add / Edit Contact"
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
                        name="contactPersonEmail"
                        render={({ field }) => (
                            <TextInput
                                label="Corporate Email"
                                withAsterisk
                                placeholder="email@company.com"
                                leftSection={<IconMail size={16} />}
                                {...field}
                                error={errors.contactPersonEmail?.message}
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

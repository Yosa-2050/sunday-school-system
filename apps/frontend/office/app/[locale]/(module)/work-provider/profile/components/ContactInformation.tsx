'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    Divider,
    Group,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { updateContactInfo } from 'app/[locale]/_api/organizations/updateOrganization';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const contactTypes = ['Mobile', 'Communication', 'Default'] as const;

export const contactSchema = z.object({
    contacts: z
        .array(
            z.object({
                type: z.enum(contactTypes),
                value: z.string().min(1, 'Required'),
                isPreferred: z.boolean().optional(),
            }),
        )
        .min(1, 'At least one contact required'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

type RawContact = {
    id?: string;
    type: 'Mobile' | 'Communication' | 'Default';
    value: string;
    isPreferred: boolean;
};

type ContactSectionProps = {
    contactsFromServer?: RawContact[];
};

// UI → API mapping
const DEFAULT_CONTACTS = [
    { label: 'Phone', type: 'Mobile', placeholder: '+251912345678' },
    { label: 'Email', type: 'Communication', placeholder: 'example@email.com' },
    {
        label: 'Other Address',
        type: 'Default',
        placeholder: '123 Main Street, City',
    },
];

export const ContactSection = ({
    contactsFromServer = [],
}: ContactSectionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const organizationId = getCookie('organization_id')?.toString() ?? '';

    const {
        control,
        getValues,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            contacts: contactsFromServer?.length
                ? contactsFromServer.map((contact) => ({
                      type: contact.type as (typeof contactTypes)[number],
                      value: contact.value,
                      isPreferred: contact.isPreferred,
                  }))
                : DEFAULT_CONTACTS.map(({ type }) => ({
                      type: type as (typeof contactTypes)[number],
                      value: '',
                      isPreferred: false,
                  })),
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: ContactFormData) =>
            updateContactInfo(organizationId, data),
        onSuccess: () => setIsEditing(false),
    });

    const onSubmit = (data: ContactFormData) => mutation.mutate(data);

    const findValueByType = (type: string) =>
        getValues('contacts')?.find((c) => c.type === type)?.value || '';

    return (
        <Box>
            <Group justify="space-between" align="center" mb="xs">
                <Title order={6}>Contact Information</Title>
                <Button
                    size="xs"
                    variant={isEditing ? 'filled' : 'light'}
                    leftSection={<IconEdit size={14} />}
                    onClick={() => {
                        if (isEditing) {
                            handleSubmit(onSubmit)();
                        } else {
                            setIsEditing(true);
                        }
                    }}
                >
                    {isEditing ? 'Save' : 'Edit'}
                </Button>
            </Group>
            <Divider mb="md" />
            <Group wrap="wrap" gap="md">
                {DEFAULT_CONTACTS.map(({ label, type, placeholder }) => (
                    <Box
                        key={type}
                        p="md"
                        w={{ base: '100%', sm: '48%', md: '30%' }}
                    >
                        <Text size="xs" color="dimmed" mb={4}>
                            {label}
                        </Text>

                        {isEditing ? (
                            <Controller
                                control={control}
                                name="contacts"
                                render={({ field: { value, onChange } }) => {
                                    const index = value.findIndex(
                                        (c) => c.type === type,
                                    );
                                    const currentValue =
                                        index >= 0
                                            ? (value[index]?.value ?? '')
                                            : '';

                                    return (
                                        <TextInput
                                            placeholder={placeholder}
                                            value={currentValue}
                                            error={
                                                errors.contacts?.[index]?.value
                                                    ?.message
                                            }
                                            onChange={(e) => {
                                                const updated = [...value];
                                                if (index >= 0) {
                                                    updated[index] = {
                                                        ...updated[index],
                                                        value: e.currentTarget
                                                            .value,
                                                        type: type as (typeof contactTypes)[number],
                                                    };
                                                } else {
                                                    updated.push({
                                                        type: type as (typeof contactTypes)[number],
                                                        value: e.currentTarget
                                                            .value,
                                                        isPreferred: false,
                                                    });
                                                }
                                                onChange(updated);
                                            }}
                                        />
                                    );
                                }}
                            />
                        ) : (
                            <Text fw={400}>{findValueByType(type) || '-'}</Text>
                        )}
                    </Box>
                ))}
            </Group>

            {isEditing && (
                <Group justify="flex-end" mt="lg">
                    <Button
                        variant="outline"
                        onClick={() => {
                            reset();
                            setIsEditing(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        loading={mutation.isPending}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Save Changes
                    </Button>
                </Group>
            )}
        </Box>
    );
};

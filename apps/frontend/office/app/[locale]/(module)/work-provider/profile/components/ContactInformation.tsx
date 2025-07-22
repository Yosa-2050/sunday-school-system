'use client';

import {
    ActionIcon,
    Box,
    Button,
    Divider,
    Group,
    Paper,
    ScrollArea,
    Table,
    Text,
    Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBuilding, IconEdit, IconX } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    submitContactPerson,
    updateContactPerson,
} from 'app/[locale]/_api/submit-contact-person';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import { type ContactFormData, ContactFormDrawer } from './ContactFormDrawer';

interface Worker {
    id: string;
    type: string;
    createdBy: string;
    employee: {
        profile: {
            firstName: string;
            middleName?: string | null;
            lastName?: string | null;
            phoneNumber?: string | null;
        };
    };
}

interface ContactSectionProps {
    workers: Worker[];
    canUpdateProfile: boolean;
}

export default function ContactSection({
    workers,
    canUpdateProfile,
}: Readonly<ContactSectionProps>) {
    const queryClient = useQueryClient();
    const organization_id = getCookie('organization_id')?.toString();
    const [opened, setOpened] = useState(false);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedWorker, setSelectedWorker] =
        useState<ContactFormData | null>(null);

    const mutation = useMutation({
        mutationFn: async (formData: ContactFormData) => {
            const [firstNameRaw, middleName = '', lastName = ''] =
                formData.contactPersonName.trim().split(' ');
            const firstName = firstNameRaw || '';

            const payload = {
                phoneNumber: formData.contactPersonPhone,
                firstName,
                middleName,
                lastName,
                position: formData.contactPersonRole,
            };

            if (formData.id) {
                return await updateContactPerson(formData.id, payload);
            }
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            return (await submitContactPerson(payload)) as any;
        },

        onSuccess: (res: { reference: string }) => {
            queryClient.invalidateQueries({
                queryKey: ['organization_id', organization_id],
            });
            queryClient.invalidateQueries({
                queryKey: ['can_organization_submit'],
            });
            notifications.show({
                title: 'Saved',
                message: 'Contact info saved successfully',
                color: 'green',
            });
            setOpened(false);
        },

        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'Something went wrong while saving',
                color: 'red',
                icon: <IconX size={16} />,
            });
        },

        onSettled: () => {
            setIsLoading(false);
        },
    });

    const handleSubmitForm = async (data: ContactFormData) => {
        setIsLoading(true);
        await mutation.mutateAsync(data);
    };

    return (
        <>
            <ContactFormDrawer
                opened={opened}
                onClose={() => setOpened(false)}
                onSubmit={handleSubmitForm}
                loading={isLoading}
                initialType={selectedType}
                setInitialType={setSelectedType}
                defaultValues={selectedWorker}
            />

            <Paper withBorder={false} p="md" mt="md" shadow="xs">
                <Box py="md">
                    <Group justify="space-between" align="center">
                        <Group gap="sm">
                            <IconBuilding size={24} stroke={1.5} />
                            <div>
                                <Title order={3}>Contact Information</Title>
                                <Text size="sm" c="dimmed">
                                    Choose position and update primary contact
                                    info
                                </Text>
                            </div>
                        </Group>

                        {canUpdateProfile && (
                            <Button
                                variant="light"
                                leftSection={<IconEdit size={16} />}
                                size="sm"
                                onClick={() => {
                                    setOpened(true);
                                }}
                            >
                                Add Employee
                            </Button>
                        )}
                    </Group>
                </Box>

                <Divider my="sm" />

                <Box mt="lg">
                    <Title order={4} mb="sm">
                        Assigned Employees
                    </Title>

                    <ScrollArea>
                        <Table striped highlightOnHover withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Position</Table.Th>
                                    <Table.Th>Full Name</Table.Th>
                                    <Table.Th>Phone</Table.Th>
                                    <Table.Th>Created By</Table.Th>
                                    {canUpdateProfile && (
                                        <Table.Th>Actions</Table.Th>
                                    )}
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {workers.map((worker) => {
                                    const profile = worker.employee.profile;
                                    const fullName = [
                                        profile.firstName,
                                        profile.middleName,
                                        profile.lastName,
                                    ]
                                        .filter(Boolean)
                                        .join(' ');
                                    return (
                                        <Table.Tr
                                            key={worker.id}
                                            className="group "
                                        >
                                            <Table.Td>{worker.type}</Table.Td>
                                            <Table.Td>{fullName}</Table.Td>
                                            <Table.Td>
                                                {profile.phoneNumber || '—'}
                                            </Table.Td>
                                            <Table.Td>
                                                {worker.createdBy}
                                            </Table.Td>
                                            {canUpdateProfile && (
                                                <Table.Td>
                                                    {' '}
                                                    <ActionIcon
                                                        onClick={() => {
                                                            setOpened(true);
                                                            setSelectedWorker({
                                                                contactPersonEmail:
                                                                    '',
                                                                contactPersonName: `${profile.firstName} ${profile.middleName} ${profile.lastName}`,
                                                                contactPersonPhone:
                                                                    profile.phoneNumber ||
                                                                    '',
                                                                contactPersonRole:
                                                                    worker.type,
                                                            });
                                                        }}
                                                        size="sm"
                                                        radius="sm"
                                                        className=""
                                                    >
                                                        <IconEdit size={16} />
                                                    </ActionIcon>
                                                </Table.Td>
                                            )}
                                        </Table.Tr>
                                    );
                                })}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Box>
            </Paper>
        </>
    );
}

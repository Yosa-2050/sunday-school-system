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
import { IconBuilding, IconEdit } from '@tabler/icons-react';
import { useState } from 'react';
import { type ContactFormData, ContactFormDrawer } from './ContactFormDrawer';

interface Worker {
    id: string;
    type: string;
    createdBy: string;
    email: string;
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
    const [opened, setOpened] = useState(false);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedWorker, setSelectedWorker] =
        useState<ContactFormData | null>(null);

    return (
        <>
            <ContactFormDrawer
                opened={opened}
                onClose={() => setOpened(false)}
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
                                    <Table.Th>Email</Table.Th>
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
                                                {worker.email || '—'}
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
                                                                employeeOrgId:
                                                                    worker.id,
                                                                email:
                                                                    worker.email ||
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

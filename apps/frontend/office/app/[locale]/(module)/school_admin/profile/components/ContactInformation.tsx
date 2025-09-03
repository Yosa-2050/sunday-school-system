'use client';

import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    Divider,
    Group,
    Paper,
    ScrollArea,
    Stack,
    Table,
    Text,
    Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconAt, IconBuilding, IconEdit, IconPhone } from '@tabler/icons-react';
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

    const isMobile = useMediaQuery('(max-width: 768px)');

    const openEditDrawer = (worker: Worker) => {
        const profile = worker.employee.profile;
        setSelectedWorker({
            employeeOrgId: worker.id,
            email: worker.email || '',
            contactPersonName: `${profile.firstName} ${profile.middleName || ''} ${profile.lastName || ''}`,
            contactPersonPhone: profile.phoneNumber || '',
            contactPersonRole: worker.type,
        });
        setOpened(true);
    };

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
                    <Group justify="space-between" align="center" wrap="wrap">
                        <Group gap="sm">
                            <IconBuilding size={24} stroke={1.5} />
                            <div>
                                <Title order={isMobile ? 4 : 3}>
                                    Contact Information
                                </Title>
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
                                size={isMobile ? 'xs' : 'sm'}
                                mt={isMobile ? 'sm' : 0}
                                onClick={() => setOpened(true)}
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

                    {isMobile ? (
                        <Stack>
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
                                    <Card
                                        key={worker.id}
                                        shadow="sm"
                                        p="md"
                                        radius="lg"
                                        withBorder
                                        style={{
                                            background:
                                                'linear-gradient(135deg, #f9fafb 0%, #f1f5f9 100%)',
                                        }}
                                    >
                                        <Group justify="space-between" mb="xs">
                                            <Badge
                                                variant="filled"
                                                color="blue"
                                                size="sm"
                                            >
                                                {worker.type}
                                            </Badge>
                                            {canUpdateProfile && (
                                                <ActionIcon
                                                    size="md"
                                                    variant="subtle"
                                                    onClick={() =>
                                                        openEditDrawer(worker)
                                                    }
                                                >
                                                    <IconEdit size={18} />
                                                </ActionIcon>
                                            )}
                                        </Group>

                                        <Text fw={600} size="md">
                                            {fullName}
                                        </Text>

                                        <Group gap="xs" mt="xs" align="center">
                                            <IconPhone size={14} />
                                            <Text size="sm">
                                                {profile.phoneNumber || '—'}
                                            </Text>
                                        </Group>

                                        <Group gap="xs" align="center">
                                            <IconAt size={14} />
                                            <Text size="sm">
                                                {worker.email || '—'}
                                            </Text>
                                        </Group>

                                        <Text size="xs" c="dimmed" mt="xs">
                                            Created by: {worker.createdBy}
                                        </Text>
                                    </Card>
                                );
                            })}
                        </Stack>
                    ) : (
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
                                            <Table.Tr key={worker.id}>
                                                <Table.Td>
                                                    {worker.type}
                                                </Table.Td>
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
                                                        <ActionIcon
                                                            size="sm"
                                                            onClick={() =>
                                                                openEditDrawer(
                                                                    worker,
                                                                )
                                                            }
                                                        >
                                                            <IconEdit
                                                                size={16}
                                                            />
                                                        </ActionIcon>
                                                    </Table.Td>
                                                )}
                                            </Table.Tr>
                                        );
                                    })}
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>
                    )}
                </Box>
            </Paper>
        </>
    );
}

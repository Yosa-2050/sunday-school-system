'use client';

import { PageContainer } from '@/components/PageContainer';
import {
    ActionIcon,
    Button,
    Drawer,
    Group,
    Menu,
    Paper,
    Select,
    Stack,
    Table,
    TableScrollContainer,
    Text,
    TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
    IconDotsVertical,
    IconEdit,
    IconPlus,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Church, OrganizationType } from './schema/type';



const initialChurches: Church[] = [
    {
        id: 'church-1',
        name: 'ፍኖተ ትጉሃን ቅዱስ ሚካኤል ቤተ ክርስቲያን',
        organizationType: OrganizationType.church,
        createdBy: 'superadmin@yopmail.com',
        createdAt: '2026-04-10 09:15:22',
    },
    {
        id: 'church-2',
        name: 'መንበረ መንግሥት ቅዱስ ገብርኤል ካቴድራል',
        organizationType: OrganizationType.SundaySchool,
        createdBy: 'admin@yopmail.com',
        createdAt: '2026-04-11 13:42:08',
    },
    {
        id: 'church-3',
        name: 'መካነ ሰላም መድኃኔዓለም ካቴድራል',
        organizationType: OrganizationType.church,
        createdBy: 'superadmin@yopmail.com',
        createdAt: '2026-04-13 16:05:41',
    },
];

const organizationTypeOptions = [
    { value: OrganizationType.church, label: OrganizationType.church },
    {
        value: OrganizationType.SundaySchool,
        label: OrganizationType.SundaySchool,
    },
];

export default function ChurchPage() {
    const [opened, { open, close }] = useDisclosure(false);
    const [churchName, setChurchName] = useState('');
    const [organizationType, setOrganizationType] = useState<string | null>(
        OrganizationType.church,
    );
    const [churches, setChurches] = useState<Church[]>(initialChurches);

    const handleCreateChurch = () => {
        const trimmedName = churchName.trim();

        if (!trimmedName) {
            notifications.show({
                color: 'red',
                title: 'Church name required',
                message: 'Please enter a church name before creating.',
            });
            return;
        }

        if (!organizationType) {
            notifications.show({
                color: 'red',
                title: 'Organization type required',
                message: 'Please select an organization type.',
            });
            return;
        }

        const newChurch: Church = {
            id: `church-${Date.now()}`,
            name: trimmedName,
            organizationType: organizationType as OrganizationType,
            createdBy: 'superadmin@yopmail.com',
            createdAt: new Date().toLocaleString('sv-SE').replace('T', ' '),
        };

        setChurches((current) => [newChurch, ...current]);
        setChurchName('');
        setOrganizationType(OrganizationType.church);
        close();

        notifications.show({
            color: 'green',
            title: 'Church created',
            message: `${trimmedName} was added successfully.`,
        });
    };

    const handleRemove = (id: string) => {
        setChurches((current) => current.filter((church) => church.id !== id));
        notifications.show({
            color: 'green',
            title: 'Church removed',
            message: 'The church was removed from the list.',
        });
    };

    const handleEdit = (name: string) => {
        //todo
    };

    return (
        <PageContainer className="mt-10 flex flex-col gap-2.5">
            <Paper
                p={{ base: 'sm', md: 'md' }}
                style={{ borderRadius: '10px' }}
            >
                <Group
                    justify="space-between"
                    align="center"
                    className="p-1 md:p-4"
                >
                    <Text className="text-md font-bold md:text-xl">
                        List of Churches
                    </Text>
                    <Button
                        onClick={open}
                        leftSection={<IconPlus size={18} />}
                        radius="md"
                    >
                        Create Church
                    </Button>
                </Group>
            </Paper>

            <Paper p="lg" style={{ borderRadius: '10px' }}>
                <TableScrollContainer minWidth={720} type="native">
                    <Table
                        withRowBorders
                        withColumnBorders
                        striped
                        verticalSpacing="md"
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Church Name</Table.Th>
                                <Table.Th>Created By</Table.Th>
                                <Table.Th>Created At</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {churches.map((church) => (
                                <Table.Tr key={church.id}>
                                    <Table.Td>{church.name}</Table.Td>
                                    <Table.Td>{church.createdBy}</Table.Td>
                                    <Table.Td>{church.createdAt}</Table.Td>
                                    <Table.Td>
                                        <Menu shadow="md" width={160}>
                                            <Menu.Target>
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="gray"
                                                >
                                                    <IconDotsVertical
                                                        size={18}
                                                    />
                                                </ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Item
                                                    leftSection={
                                                        <IconEdit size={16} />
                                                    }
                                                    onClick={() =>
                                                        handleEdit(church.name)
                                                    }
                                                >
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item
                                                    color="red"
                                                    leftSection={
                                                        <IconTrash size={16} />
                                                    }
                                                    onClick={() =>
                                                        handleRemove(church.id)
                                                    }
                                                >
                                                    Remove
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </TableScrollContainer>
            </Paper>

            <Drawer
                opened={opened}
                onClose={close}
                position="right"
                size="md"
                title={
                    <Text className="text-primary mb-2 text-xl font-bold">
                        Create Church
                    </Text>
                }
                closeButtonProps={{
                    icon: <IconX size={20} stroke={1.5} />,
                }}
            >
                <Stack gap="md">
                    <TextInput
                        label="Church Name"
                        placeholder="Enter church name"
                        value={churchName}
                        onChange={(event) =>
                            setChurchName(event.currentTarget.value)
                        }
                        withAsterisk
                    />

                    <Select
                        label="Organization Type"
                        placeholder="Select organization type"
                        data={organizationTypeOptions}
                        value={organizationType}
                        onChange={setOrganizationType}
                        withAsterisk
                    />

                    <Button onClick={handleCreateChurch} fullWidth>
                        Create Church
                    </Button>
                </Stack>
            </Drawer>
        </PageContainer>
    );
}

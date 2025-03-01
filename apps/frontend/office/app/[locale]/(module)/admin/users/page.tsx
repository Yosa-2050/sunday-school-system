'use client';

import { useState } from 'react';
import {
    Flex,
    Paper,
    Table,
    Text,
    TextInput,
    Select,
    Group,
    Menu,
    ActionIcon,
    Tooltip,
    Divider,
    TableScrollContainer,
    Checkbox,
} from '@mantine/core';
import type { Users } from 'app/[locale]/_api/users/fetch-user';
import { CreateUser } from './_components/CreateUser';
import {
    IconSearch,
    IconDownload,
    IconDotsVertical,
} from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { sampleUsers } from './_components/users';

// Utility function to handle export (can be adjusted for CSV, JSON, etc.)
const exportToCSV = (users: Users[]) => {
    const header = [
        'Full Name',
        'Email',
        'Role',
        'Status',
        'Created By',
        'Created At',
    ];
    const rows = users.map((user) => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.userType,
        user.status,
        user.createdBy,
        DateTime.fromISO(user.createdAt).toFormat('yyyy-MM-dd HH:mm:ss'),
    ]);
    const csvContent = [header, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_data.csv';
    a.click();
};

export const UsersPage = () => {
    const [selection, setSelection] = useState(['1']);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    // Apply search and filter logic
    const filteredUsers = sampleUsers.filter((user) => {
        return (
            (user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.lastName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (roleFilter ? user.userType === roleFilter : true)
        );
    });

    // Sorting
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.firstName.localeCompare(b.firstName);
        }
        return b.firstName.localeCompare(a.firstName);
    });

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id],
        );
    const toggleAll = () =>
        setSelection((current) =>
            current.length === sortedUsers.length
                ? []
                : sortedUsers.map((item) => item.id),
        );

    const rows = sortedUsers.map((user) => (
        <Table.Tr
            key={user.id}
            style={{
                transition: 'background-color 0.3s ease',
                cursor: 'pointer',
            }}
        >
            <Table.Td>
                <Checkbox
                    checked={selection.includes(user.id)}
                    onChange={() => toggleRow(user.id)}
                />
            </Table.Td>
            <Table.Td>{`${user.firstName} ${user.lastName}`}</Table.Td>
            <Table.Td>{user.email}</Table.Td>
            <Table.Td>{user.userType}</Table.Td>
            <Table.Td>{user.status}</Table.Td>
            <Table.Td>{user.createdBy}</Table.Td>
            <Table.Td>
                {DateTime.fromISO(user.createdAt).toFormat(
                    'yyyy-MM-dd HH:mm:ss',
                )}
            </Table.Td>
            <Table.Td>
                <Group gap={4} align="center">
                    <Menu width={200}>
                        <Menu.Target>
                            <IconDotsVertical size={18} />
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item>Edit</Menu.Item>
                            <Menu.Item>Delete</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align={'center'} justify={'space-between'} className="p-4">
                <Text className="font-bold text-xl">List of Users</Text>
                <CreateUser />
            </Flex>

            <Divider my="md" />

            {/* Search, Filter, Sort, Export Controls */}
            <Group justify="space-between" className="mb-4">
                <TextInput
                    leftSection={<IconSearch />}
                    placeholder="Search users"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: 300 }}
                />
                <Group>
                    <Select
                        placeholder="Select role"
                        value={roleFilter}
                        onChange={(data) => setRoleFilter(data ?? '')}
                        data={[
                            { value: '', label: 'All Roles' },
                            { value: 'admin', label: 'Admin' },
                            { value: 'editor', label: 'Editor' },
                            { value: 'viewer', label: 'Viewer' },
                        ]}
                        style={{ width: 200 }}
                    />
                    <Select
                        placeholder="Sort by"
                        value={sortOrder}
                        onChange={(data) => setSortOrder(data ?? '')}
                        data={[
                            { value: 'asc', label: 'Sort Ascending' },
                            { value: 'desc', label: 'Sort Descending' },
                        ]}
                        style={{ width: 200 }}
                    />
                    <Tooltip label="Export to CSV" withArrow>
                        <ActionIcon
                            onClick={() => exportToCSV(sampleUsers)}
                            variant="outline"
                            color="green"
                            radius="xl"
                            size="sm"
                        >
                            <IconDownload size={18} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>

            {/* Table */}
            <TableScrollContainer minWidth={800} type="native">
                <Table
                    withRowBorders
                    withColumnBorders
                    striped
                    verticalSpacing={'md'}
                >
                    <Table.Thead
                        style={{
                            backgroundColor: '#f4f4f4',
                            fontWeight: 'bold',
                        }}
                    >
                        <Table.Tr>
                            <Table.Th>
                                <Checkbox
                                    onChange={toggleAll}
                                    checked={
                                        selection.length === sortedUsers.length
                                    }
                                    indeterminate={
                                        selection.length > 0 &&
                                        selection.length !== sortedUsers.length
                                    }
                                />
                            </Table.Th>
                            <Table.Th>Full Name</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Role</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Created By</Table.Th>
                            <Table.Th>Created At</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </TableScrollContainer>
        </Paper>
    );
};

export default UsersPage;

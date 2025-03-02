'use client';

import { useTranslations } from 'next-intl';
import {
    Checkbox,
    Divider,
    Flex,
    Group,
    Menu,
    Paper,
    Select,
    Table,
    TableScrollContainer,
    Text,
    TextInput,
    Tooltip
} from '@mantine/core';
import { IconDotsVertical, IconDownload, IconSearch } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { CreateUser } from './_components/CreateUser';
import { sampleUsers } from './_components/users';
import { Link } from '@/i18n/routing';


const UsersPage = () => {
    const t = useTranslations('usersPage');

    const [selection, setSelection] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useQueryState('search', { defaultValue: '' });
    const [roleFilter, setRoleFilter] = useQueryState('filter', { defaultValue: '' });
    const [sortOrder, setSortOrder] = useQueryState('sort', { defaultValue: 'asc' });

    const filteredUsers = sampleUsers.filter((user) =>
        (user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (roleFilter ? user.userType === roleFilter : true)
    );

    const sortedUsers = [...filteredUsers].sort((a, b) =>
        sortOrder === 'asc' ? a.firstName.localeCompare(b.firstName) : b.firstName.localeCompare(a.firstName)
    );

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );

    const toggleAll = () =>
        setSelection((current) => (current.length === sortedUsers.length ? [] : sortedUsers.map((item) => item.id)));

    const rows = sortedUsers.map((user) => (
        <Table.Tr key={user.id}>
            <Table.Td>
                <Checkbox checked={selection.includes(user.id)} onChange={() => toggleRow(user.id)} />
            </Table.Td>
            <Table.Td>{`${user.firstName} ${user.lastName}`}</Table.Td>
            <Table.Td>
                <Link href={`mailto:${user.email}`} className='hover:underline '>
                    {user.email}
                </Link>
            </Table.Td>
            <Table.Td>{user.userType}</Table.Td>
            <Table.Td className={`capitalize ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{user.status}</Table.Td>
            <Table.Td>{user.createdBy}</Table.Td>
            <Table.Td>{DateTime.fromISO(user.createdAt).toFormat('yyyy-MM-dd HH:mm:ss')}</Table.Td>
            <Table.Td>
                <Group gap={4} align="center">
                    <Menu width={200}>
                        <Menu.Target>
                            <IconDotsVertical size={18} />
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item>{t('table.edit')}</Menu.Item>
                            <Menu.Item>{t('table.delete')}</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align="center" justify="space-between" className="p-4">
                <Text className="font-bold text-xl">{t('title')}</Text>
                <CreateUser />
            </Flex>

            <Divider my="md" />

            {/* Search, Filter, Sort, Export Controls */}
            <Group justify="space-between" className="mb-4">
                <TextInput
                    leftSection={<IconSearch size={18} />}
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: 300 }}
                />
                <Group>
                    <Select
                        placeholder={t('selectRole')}
                        value={roleFilter}
                        onChange={(data) => setRoleFilter(data ?? '')}
                        data={[
                            { value: '', label: t('allRoles') },
                            { value: 'ADMINISTRATOR', label: t('roles.administrator') },
                            { value: 'JOB_SEEKER', label: t('roles.jobSeeker') },
                            { value: 'WORK_PROVIDER', label: t('roles.workProvider') }
                        ]}
                        style={{ width: 200 }}
                    />
                    <Select
                        placeholder={t('sortBy')}
                        value={sortOrder}
                        onChange={(data) => setSortOrder(data ?? '')}
                        data={[
                            { value: 'asc', label: t('sortOptions.asc') },
                            { value: 'desc', label: t('sortOptions.desc') }
                        ]}
                        style={{ width: 200 }}
                    />
                    <Tooltip label={t('exportCSV')} withArrow>
                            <IconDownload size={18} />
                    </Tooltip>
                </Group>
            </Group>

            {/* Table */}
            <TableScrollContainer minWidth={800} type="native">
                <Table withRowBorders withColumnBorders striped verticalSpacing="md">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>
                                <Checkbox
                                    onChange={toggleAll}
                                    checked={selection.length === sortedUsers.length}
                                    indeterminate={selection.length > 0 && selection.length !== sortedUsers.length}
                                />
                            </Table.Th>
                            <Table.Th>{t('table.fullName')}</Table.Th>
                            <Table.Th>{t('table.email')}</Table.Th>
                            <Table.Th>{t('table.role')}</Table.Th>
                            <Table.Th>{t('table.status')}</Table.Th>
                            <Table.Th>{t('table.createdBy')}</Table.Th>
                            <Table.Th>{t('table.createdAt')}</Table.Th>
                            <Table.Th>{t('table.actions')}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </TableScrollContainer>
        </Paper>
    );
};

export default UsersPage;

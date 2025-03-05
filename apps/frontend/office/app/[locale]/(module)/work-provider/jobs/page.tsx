'use client';

import { Link, useRouter } from '@/i18n/routing';
import {
    Badge,
    Button,
    Card,
    Checkbox,
    Divider,
    Flex,
    Group,
    Menu,
    Paper,
    Select,
    Stack,
    Table,
    TableScrollContainer,
    Text,
    TextInput,
    Tooltip,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
    IconDotsVertical,
    IconDownload,
    IconPlus,
    IconSearch,
} from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { sampleUsers } from '../../admin/users/_components/users';


const UsersPage = () => {
    const t = useTranslations('jobsPage');
    const isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter();

    const [selection, setSelection] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useQueryState('search', {
        defaultValue: '',
    });
    const [roleFilter, setRoleFilter] = useQueryState('filter', {
        defaultValue: '',
    });
    const [sortOrder, setSortOrder] = useQueryState('sort', {
        defaultValue: 'asc',
    });

    const filteredUsers = sampleUsers.filter(
        (user) =>
            (user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.lastName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (roleFilter ? user.userType === roleFilter : true),
    );

    const sortedUsers = [...filteredUsers].sort((a, b) =>
        sortOrder === 'asc'
            ? a.firstName.localeCompare(b.firstName)
            : b.firstName.localeCompare(a.firstName),
    );

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

    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align="center" justify="space-between" className="p-4">
                <Text className="font-bold text-xl">{t('title')}</Text>
                <Button
                    leftSection={<IconPlus size={18} />}
                    variant="filled"
                    color="blue"
                    className="text-white"
                   onClick={() => {router.push('/work-provider/jobs/create');}}
                >
                    {t('createJob')}
                </Button>
            </Flex>

            <Divider my="md" />

            {/* Search, Filter, Sort Controls */}
            <Group justify="space-between" className="mb-4">
                <TextInput
                    leftSection={<IconSearch size={18} />}
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: 300 }}
                />
                <Flex gap={'xs'} align={'center'}>
                    <Select
                        placeholder={t('selectRole')}
                        value={roleFilter}
                        size="sm"
                        onChange={(data) => setRoleFilter(data ?? '')}
                        data={[
                            { value: '', label: t('allRoles') },
                            {
                                value: 'ADMINISTRATOR',
                                label: t('roles.administrator'),
                            },
                            {
                                value: 'JOB_SEEKER',
                                label: t('roles.jobSeeker'),
                            },
                            {
                                value: 'WORK_PROVIDER',
                                label: t('roles.workProvider'),
                            },
                        ]}
                        style={{ width: 150 }}
                    />
                    <Select
                        placeholder={t('sortBy')}
                        value={sortOrder}
                        onChange={(data) => setSortOrder(data ?? '')}
                        data={[
                            { value: 'asc', label: t('sortOptions.asc') },
                            { value: 'desc', label: t('sortOptions.desc') },
                        ]}
                        style={{ width: 150 }}
                    />
                    <Tooltip label={t('exportCSV')} withArrow>
                        <IconDownload size={18} />
                    </Tooltip>
                </Flex>
            </Group>

            {/* Responsive Table or Cards */}
            {isMobile ? (
                <Stack>
                    {sortedUsers.map((user) => (
                        <Card
                            key={user.id}
                            shadow="sm"
                            p="lg"
                            radius="md"
                            withBorder
                        >
                            <Flex justify="space-between" align="center">
                                <Text
                                    fw={500}
                                >{`${user.firstName} ${user.lastName}`}</Text>
                                <Badge
                                    color={
                                        user.status === 'active'
                                            ? 'green'
                                            : 'red'
                                    }
                                >
                                    {user.status}
                                </Badge>
                            </Flex>
                            <Divider my="xs" />
                            <Text size="sm">{user.email}</Text>
                            <Text size="sm" c="dimmed" className="capitalize">
                                {user.userType}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {DateTime.fromISO(user.createdAt).toFormat(
                                    'yyyy-MM-dd HH:mm:ss',
                                )}
                            </Text>
                            <Group mt="md">
                                <Button variant="light" size="xs">
                                    {t('table.edit')}
                                </Button>
                                <Button variant="light" size="xs" color="red">
                                    {t('table.delete')}
                                </Button>
                            </Group>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <TableScrollContainer minWidth={800} type="native">
                    <Table
                        withRowBorders
                        withColumnBorders
                        striped
                        verticalSpacing="md"
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>
                                    <Checkbox
                                        onChange={toggleAll}
                                        checked={
                                            selection.length ===
                                            sortedUsers.length
                                        }
                                        indeterminate={
                                            selection.length > 0 &&
                                            selection.length !==
                                                sortedUsers.length
                                        }
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
                        <Table.Tbody>
                            {sortedUsers.map((user) => (
                                <Table.Tr key={user.id}>
                                    <Table.Td>
                                        <Checkbox
                                            checked={selection.includes(
                                                user.id,
                                            )}
                                            onChange={() => toggleRow(user.id)}
                                        />
                                    </Table.Td>
                                    <Table.Td>{`${user.firstName} ${user.lastName}`}</Table.Td>
                                    <Table.Td>
                                        <Link
                                            href={`mailto:${user.email}`}
                                            className="hover:underline "
                                        >
                                            {user.email}
                                        </Link>
                                    </Table.Td>
                                    <Table.Td>{user.userType}</Table.Td>
                                    <Table.Td
                                        className={
                                            user.status === 'active'
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }
                                    >
                                        {user.status}
                                    </Table.Td>
                                    <Table.Td>{user.createdBy}</Table.Td>
                                    <Table.Td>
                                        {DateTime.fromISO(
                                            user.createdAt,
                                        ).toFormat('yyyy-MM-dd HH:mm:ss')}
                                    </Table.Td>
                                    <Table.Td>
                                        <Menu width={200}>
                                            <Menu.Target>
                                                <IconDotsVertical size={18} />
                                            </Menu.Target>
                                        </Menu>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </TableScrollContainer>
            )}
        </Paper>
    );
};

export default UsersPage;

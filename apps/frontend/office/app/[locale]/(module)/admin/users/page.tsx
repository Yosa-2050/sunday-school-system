'use client';

import NoData from '@/components/NoData';
import { Link } from '@/i18n/routing';
import {
    Badge,
    Button,
    Card,
    Checkbox,
    Divider,
    Flex,
    Group,
    LoadingOverlay,
    Menu,
    Pagination,
    Paper,
    Select,
    Stack,
    Table,
    TableScrollContainer,
    Text,
    TextInput,
    Tooltip,
} from '@mantine/core';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import {
    IconDotsVertical,
    IconDownload,
    IconSearch,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { type Daum, fetchUsers } from 'app/[locale]/_api/users/fetch-user';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { CreateUser } from './_components/CreateUser';

const UsersPage = () => {
    const t = useTranslations('usersPage');
    const isMobile = useMediaQuery('(max-width: 768px)');

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
    const [page, setPage] = useQueryState('page', { defaultValue: '1' });
    const [limit, setLimit] = useQueryState('limit', { defaultValue: '10' });

    const [debouncedSearch] = useDebouncedValue(searchQuery, 500);

    // Fetch users using TanStack Query
    const { data, isLoading, error } = useQuery({
        queryKey: [
            'users'
        ],
        queryFn: () =>
            fetchUsers({
                // status: roleFilter,
                pagination: {
                    search: debouncedSearch,
                    page: +page,
                    limit: +limit,
                },
            }),
    });

    if (isLoading) {
        return <LoadingOverlay visible={true} h={'100%'} />;
    }

    if (error) {
        return <Text color="red">{t('error')}</Text>;
    }

    const users = data?.data ?? [];

    const toggleRow = (email: string) =>
        setSelection((current) =>
            current.includes(email)
                ? current.filter((item) => item !== email)
                : [...current, email],
        );

    const toggleAll = () =>
        setSelection((current) =>
            current.length === users.length
                ? []
                : users.map((user: Daum) => user.email ?? ''),
        );

    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align="center" justify="space-between" className="p-4">
                <Text className="font-bold text-xl">{t('title')}</Text>
                <CreateUser />
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

            {/* No Data State */}
            {users.length === 0 ? (
                <NoData />
                // biome-ignore lint/nursery/noNestedTernary: <explanation>
            ) : isMobile ? (
                <Stack>
                    {users.map((user: Daum) => (
                        <Card
                            key={user.email}
                            shadow="sm"
                            p="lg"
                            radius="md"
                            withBorder
                        >
                            <Flex justify="space-between" align="center">
                                <Text fw={500}>{user.fullName}</Text>
                                <Badge color={user.isActive ? 'green' : 'red'}>
                                    {user.isActive
                                        ? t('status.active')
                                        : t('status.inactive')}
                                </Badge>
                            </Flex>
                            <Divider my="xs" />
                            <Text size="sm">{user.email}</Text>
                            <Text size="xs" c="dimmed">
                                {DateTime.fromISO(
                                    user.createdDate ?? '',
                                ).toFormat('yyyy-MM-dd HH:mm:ss')}
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
                                            selection.length === users.length
                                        }
                                        indeterminate={
                                            selection.length > 0 &&
                                            selection.length !== users.length
                                        }
                                    />
                                </Table.Th>
                                <Table.Th>{t('table.fullName')}</Table.Th>
                                <Table.Th>{t('table.email')}</Table.Th>
                                <Table.Th>{t('table.status')}</Table.Th>
                                <Table.Th>{t('table.createdBy')}</Table.Th>
                                <Table.Th>{t('table.createdAt')}</Table.Th>
                                <Table.Th>{t('table.actions')}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {users.map((user: Daum) => (
                                <Table.Tr key={user.email}>
                                    <Table.Td>
                                        <Checkbox
                                            checked={selection.includes(
                                                user.email ?? '',
                                            )}
                                            onChange={() =>
                                                toggleRow(user.email ?? '')
                                            }
                                        />
                                    </Table.Td>
                                    <Table.Td>{user.fullName}</Table.Td>
                                    <Table.Td>
                                        <Link
                                            href={`mailto:${user.email}`}
                                            className="hover:underline"
                                        >
                                            {user.email}
                                        </Link>
                                    </Table.Td>
                                    <Table.Td
                                        className={
                                            user.isActive
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }
                                    >
                                        {user.isActive
                                            ? t('status.active')
                                            : t('status.inactive')}
                                    </Table.Td>
                                    <Table.Td>{user.createdBy}</Table.Td>
                                    <Table.Td>
                                        {DateTime.fromISO(
                                            user.createdDate ?? '',
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

            <Flex justify="center" mt="md">
                <Pagination
                    total={data?.totalPages ?? 1}
                    value={+page}
                    onChange={(value) => setPage(value.toString())}
                />
            </Flex>
        </Paper>
    );
};

export default UsersPage;

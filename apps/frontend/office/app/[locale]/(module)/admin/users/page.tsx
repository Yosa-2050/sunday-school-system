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
    Paper,
    Pill,
    Stack,
    Table,
    TableScrollContainer,
    Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
    PER_PAGE,
    entityParamSchema,
    entityParamSerializer,
    logger,
} from '@shega/shared';
import {
    EntityColumn,
    EntityFilter,
    EntityPagination,
    EntitySearch,
} from '@shega/ui';
import { IconDotsVertical, IconDownload, IconX } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { exportSelectedUsers } from 'app/[locale]/_api/users/export-selected-users';
import { type Daum, fetchUsers } from 'app/[locale]/_api/users/fetch-user';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { parseAsJson, useQueryState } from 'nuqs';
import { useCallback, useState } from 'react';
import { CreateUser } from './_components/CreateUser';

interface Filters {
    roles: string[];
    status: string;
    sort: { [key: string]: 'asc' | 'desc' };
}

const UsersPage = () => {
    const t = useTranslations('usersPage');
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [selection, setSelection] = useState<string[]>([]);
    const [filters, setFilters] = useQueryState<Filters | null>('filters', {
        defaultValue: null,
        parse: (value) => {
            try {
                return JSON.parse(decodeURIComponent(value));
            } catch {
                return null;
            }
        },
        serialize: (value) =>
            value ? encodeURIComponent(JSON.stringify(value)) : '',
    });

    const exportToCsv = useCallback((list: string[]) => {
        if (!list || list.length === 0) {
            alert('No data available to export');
            return;
        }

        // Convert rows to CSV with proper quoting
        const csvContent = list
            .map((row) =>
                row
                    .split(',')
                    .map((v) => `"${v.replace(/"/g, '""')}"`)
                    .join(','),
            )
            .join('\n');

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'selected_users.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, []);

    const [entityParams] = useQueryState(
        'users',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: PER_PAGE,
        }),
    );

    const roles = [
        { value: 'ADMINISTRATOR', label: t('roles.administrator') },
        { value: 'WORK_PROVIDER', label: t('roles.workProvider') },
        { value: 'JOB_SEEKER', label: t('roles.jobSeeker') },
    ];

    const handleRoleSelect = (selectedRoles: string[]) => {
        const newFilters = {
            ...filters,
            roles: selectedRoles,
            status: filters?.status || '',
            sort: filters?.sort || { createdAt: 'desc' },
        };

        if (selectedRoles.length > 0 || newFilters.status) {
            setFilters(newFilters);
        } else {
            setFilters(null);
        }
    };

    const handleStatusChange = (status: string) => {
        const newFilters = {
            ...filters,
            status,
            roles: filters?.roles || [],
            sort: filters?.sort || { createdAt: 'desc' },
        };

        if (newFilters.roles.length > 0 || newFilters.status) {
            setFilters(newFilters);
        } else {
            setFilters(null);
        }
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['users', entityParamSerializer(entityParams)],
        queryFn: () => fetchUsers(entityParamSerializer(entityParams)),
        enabled: !!entityParams,
    });

    const exportMutation = useMutation({
        mutationKey: ['exports'],
        mutationFn: exportSelectedUsers,
        onSuccess: (list) => {
            exportToCsv(list);
        },
        onError: (error) => {
            logger.log(error);
            notifications.show({
                title: 'Export Users',
                message: 'Something went wrong while exporting selected users',
                color: 'red',
            });
        },
    });

    if (isLoading) {
        return <LoadingOverlay visible={true} h={'100%'} />;
    }

    if (error) {
        return <Text color="red">{t('error')}</Text>;
    }

    const users = data?.data ?? [];

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id],
        );

    const toggleAll = () =>
        setSelection((current) =>
            current.length === users.length
                ? []
                : users.map((user: Daum) => user.id ?? ''),
        );

    const activeFilters = filters
        ? [
              {
                  type: 'Role',
                  filters: filters.roles.map((role) => ({
                      label: roles.find((r) => r.value === role)?.label,
                      value: role,
                  })),
              },
              {
                  type: 'Status',
                  filters: filters.status
                      ? [
                            {
                                label: t(
                                    `status.${filters.status.toLowerCase()}`,
                                ),
                                value: filters.status,
                            },
                        ]
                      : [],
              },
          ].filter((group) => group.filters.length > 0)
        : [];

    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align="center" justify="space-between" className="p-4">
                <Text className="font-bold text-xl">{t('title')}</Text>
                <CreateUser />
            </Flex>

            <Divider my="md" />

            {/* Search, Filter, Sort Controls */}
            <Group justify="space-between" className="mb-4">
                <EntitySearch
                    entity="users"
                    placeholder={t('searchPlaceholder')}
                    className="!w-[300px]"
                />
                <Flex gap={'xs'} align={'center'}>
                    <EntityFilter
                        entity="users"
                        filterOptions={roles}
                        mode="select"
                        field="roles.role"
                        placeholder="Filter By Role"
                    />
                    <EntityFilter
                        entity="users"
                        filterOptions={[
                            { value: '', label: t('status.all') },
                            { value: 'true', label: t('status.active') },
                            { value: 'false', label: t('status.inactive') },
                        ]}
                        mode="select"
                        field="isActive"
                        placeholder="Filter By Status"
                    />
                    <Button
                        variant="light"
                        leftSection={<IconDownload size={18} />}
                        disabled={selection?.length === 0}
                        onClick={() => exportMutation.mutate(selection)}
                        loading={exportMutation.isPending}
                    >
                        {t('exportCSV')}
                    </Button>
                </Flex>
            </Group>

            {/* Active Filters and Sort */}
            <Group gap="sm" className="mb-4">
                {activeFilters.map((group) => (
                    <Group key={group.type} gap="sm">
                        <Text size="sm" c="dimmed">
                            {group.type}:
                        </Text>
                        {group.filters.map((filter) => (
                            <Badge
                                key={filter.value}
                                rightSection={
                                    <IconX
                                        size={12}
                                        onClick={() => {
                                            if (group.type === 'Role') {
                                                handleRoleSelect(
                                                    filters?.roles.filter(
                                                        (r) =>
                                                            r !== filter.value,
                                                    ) || [],
                                                );
                                            } else if (
                                                group.type === 'Status'
                                            ) {
                                                handleStatusChange('');
                                            }
                                        }}
                                    />
                                }
                            >
                                {filter.label}
                            </Badge>
                        ))}
                    </Group>
                ))}
                {filters?.sort && Object.keys(filters.sort).length > 0 && (
                    <Group gap="sm">
                        <Text size="sm" c="dimmed">
                            Sort:
                        </Text>
                        <Badge
                            rightSection={
                                <IconX
                                    size={12}
                                    onClick={() =>
                                        setFilters({ ...filters, sort: {} })
                                    }
                                />
                            }
                        >
                            {Object.keys(filters.sort)[0]}
                            {Object.values(filters.sort)[0] as React.ReactNode}
                        </Badge>
                    </Group>
                )}
            </Group>

            {/* No Data State */}
            {users.length === 0 ? (
                <NoData />
            ) : // biome-ignore lint/nursery/noNestedTernary: <explanation>
            isMobile ? (
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
                                <Table.Th>{t('table.role')}</Table.Th>
                                <Table.Th>{t('table.createdBy')}</Table.Th>
                                <Table.Th>
                                    <EntityColumn
                                        entity="users"
                                        field="createdAt"
                                        label={t('table.createdAt')}
                                    />
                                </Table.Th>
                                <Table.Th>{t('table.status')}</Table.Th>
                                <Table.Th>{t('table.actions')}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation> */}
                            {users.map((user: Daum) => (
                                <Table.Tr key={user.id}>
                                    <Table.Td>
                                        <Checkbox
                                            checked={selection.includes(
                                                user.id ?? '',
                                            )}
                                            onChange={() =>
                                                toggleRow(user.id ?? '')
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
                                    <Table.Td>
                                        {user.role === 'WORK_PROVIDER'
                                            ? 'Employer'
                                            : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                              user.role === 'ADMINISTRATOR'
                                              ? 'Administrator'
                                              : 'Job Seeker'}
                                    </Table.Td>
                                    <Table.Td>{user.createdBy}</Table.Td>
                                    <Table.Td>
                                        {DateTime.fromISO(
                                            user.createdDate ?? '',
                                        ).toFormat('yyyy-MM-dd HH:mm:ss')}
                                    </Table.Td>
                                    <Table.Td>
                                        <Pill
                                            variant="filled"
                                            className={`bg-gray-100 ${user.isActive ? 'text-green-600' : 'text-red-600'}`}
                                        >
                                            {user.isActive
                                                ? t('status.active')
                                                : t('status.inactive')}
                                        </Pill>
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

            {/* Pagination */}
            <EntityPagination entity="users" total={data?.total ?? 0} />
        </Paper>
    );
};

export default UsersPage;

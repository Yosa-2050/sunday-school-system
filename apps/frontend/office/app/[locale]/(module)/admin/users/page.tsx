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
    Modal,
    Paper,
    Pill,
    Stack,
    Table,
    TableScrollContainer,
    Text,
    TextInput,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Can from '@/components/Can';
import { PageContainer } from '@/components/PageContainer';
import { exportSelectedUsers } from 'app/[locale]/_api/users/export-selected-users';
import { type Daum, fetchUsers } from 'app/[locale]/_api/users/fetch-user';
import {
    activateUser,
    deactivateUser,
} from 'app/[locale]/_api/users/userStatus';
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
    const queryClient = useQueryClient();
    const t = useTranslations('usersPage');
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [selection, setSelection] = useState<string[]>([]);
    const [opened, { open, close }] = useDisclosure(false);
    const [openedActivation, activationHandlers] = useDisclosure(false);

    const [reason, setReason] = useState('');

    const [selectedUser, setSelectedUser] = useState<{
        id: string;
        fullName: string;
    } | null>(null);

    const deactivateUserMutation = useMutation({
        mutationFn: async ({
            userId,
            reason,
        }: {
            userId: string;
            reason: string;
        }) => await deactivateUser(userId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setReason('');
            notifications.show({
                title: 'Deactivation',
                message: 'User has been successfully deactivated',
                color: 'green',
            });
        },
        onError: () => {
            notifications.show({
                title: 'Deactivation',
                message: 'An error occurred while deactivating the user',
                color: 'red',
            });
        },
    });

    const activateUserMutation = useMutation({
        mutationFn: async (userId: string) => await activateUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            notifications.show({
                title: 'Activation',
                message: 'User has been successfully activated',
                color: 'green',
            });
        },
        onError: () => {
            notifications.show({
                title: 'Activation',
                message: 'An error occurred while activating the user',
                color: 'red',
            });
        },
    });

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
        { value: '', label: t('roles.allroles') },
        { value: 'ADMINISTRATOR', label: t('roles.administrator') },
        { value: 'school_admin', label: t('roles.workProvider') },
        { value: 'JOB_SEEKER', label: t('roles.jobSeeker') },
        { value: 'MENTOR', label: t('roles.mentor') },
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
        mutationKey: [
            'exports',
            entityParamSerializer({
                ...entityParams,
                pp: data?.total,
            }),
        ],
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
        <PageContainer className="flex flex-col gap-2.5">
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
                            onClick={() => {
                                const payload =
                                    selection.length === 0
                                        ? entityParamSerializer({
                                              ...entityParams,
                                              pp: data?.total,
                                          })
                                        : selection;
                                const type: 'filter' | 'selected' =
                                    selection.length === 0
                                        ? 'filter'
                                        : 'selected';
                                exportMutation.mutate({ payload, type });
                            }}
                            loading={exportMutation.isPending}
                        >
                            {t('exportCSV')}
                        </Button>
                    </Flex>
                </Group>
            </Paper>

            <Paper
                shadow="xs"
                p={{ base: 'sm', md: 'md' }}
                style={{ borderRadius: '10px' }}
            >
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
                                                                r !==
                                                                filter.value,
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
                                {
                                    Object.values(
                                        filters.sort,
                                    )[0] as React.ReactNode
                                }
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
                                    <Badge color={user.isActive ? '' : 'red'}>
                                        {user.isActive
                                            ? t('status.active')
                                            : t('status.inactive')}
                                    </Badge>
                                </Flex>
                                <Divider my="xs" />
                                <Text size="sm">{user.email}</Text>
                                <Text size="xs" c="dimmed">
                                    {user.createdDate
                                        ? DateTime.fromJSDate(
                                              new Date(user.createdDate),
                                          ).toFormat('yyyy-MM-dd')
                                        : 'Unknown'}
                                </Text>
                                <Group mt="md">
                                    <Button variant="light" size="xs">
                                        {t('table.edit')}
                                    </Button>
                                    <Button
                                        variant="light"
                                        size="xs"
                                        color="red"
                                    >
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
                            verticalSpacing="xs"
                        >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>
                                        <Checkbox
                                            onChange={toggleAll}
                                            checked={
                                                selection.length ===
                                                users.length
                                            }
                                            indeterminate={
                                                selection.length > 0 &&
                                                selection.length !==
                                                    users.length
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
                                    <Can roles={['super_admin']}>
                                        <Table.Th>
                                            {t('table.actions')}
                                        </Table.Th>
                                    </Can>
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
                                        <Table.Td>{user.role}</Table.Td>
                                        <Table.Td>{user.createdBy}</Table.Td>
                                        <Table.Td>
                                            {user.createdDate
                                                ? DateTime.fromJSDate(
                                                      new Date(
                                                          user.createdDate,
                                                      ),
                                                  ).toFormat('yyyy-MM-dd')
                                                : 'Unknown'}
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

                                        <Can roles={['super_admin']}>
                                            <Table.Td>
                                                <Menu width={200}>
                                                    <Menu.Target>
                                                        <IconDotsVertical
                                                            size={18}
                                                            className="cursor-pointer"
                                                        />
                                                    </Menu.Target>
                                                    <Menu.Dropdown>
                                                        {user.isActive ? (
                                                            <Menu.Item
                                                                color="red"
                                                                onClick={() => {
                                                                    setSelectedUser(
                                                                        {
                                                                            id: user.id,
                                                                            fullName:
                                                                                user.fullName ??
                                                                                '',
                                                                        },
                                                                    );
                                                                    open();
                                                                }}
                                                            >
                                                                Deactivate
                                                            </Menu.Item>
                                                        ) : (
                                                            <Menu.Item
                                                                onClick={() => {
                                                                    setSelectedUser(
                                                                        {
                                                                            id: user.id,
                                                                            fullName:
                                                                                user.fullName ??
                                                                                '',
                                                                        },
                                                                    );
                                                                    activationHandlers.open();
                                                                }}
                                                            >
                                                                Activate
                                                            </Menu.Item>
                                                        )}
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Table.Td>
                                        </Can>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                        <Modal
                            opened={opened}
                            onClose={() => {
                                close();
                                setSelectedUser(null);
                            }}
                            title="User Deactivation"
                            centered
                        >
                            <TextInput
                                placeholder="Enter the reason for deactivation"
                                label="Reason"
                                description="Please provide a reason for deactivating this user."
                                required
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />

                            <Group mt="xl" justify="flex-end">
                                <Button variant="default" onClick={close}>
                                    Cancel
                                </Button>
                                <Button
                                    color="red"
                                    loading={deactivateUserMutation.isPending}
                                    onClick={async () => {
                                        if (selectedUser) {
                                            await deactivateUserMutation.mutateAsync(
                                                {
                                                    userId: selectedUser.id,
                                                    reason,
                                                },
                                            );
                                            close();
                                            setSelectedUser(null);
                                        }
                                    }}
                                >
                                    Deactivate
                                </Button>
                            </Group>
                        </Modal>
                        <Modal
                            opened={openedActivation}
                            onClose={() => {
                                activationHandlers.close();
                                setSelectedUser(null);
                            }}
                            title="User Activation"
                            centered
                        >
                            <Text>
                                Are you sure you want to activate{' '}
                                <Text span fw={600}>
                                    {selectedUser?.fullName}{' '}
                                </Text>
                                ?
                            </Text>

                            <Group mt="xl" justify="flex-end">
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        activationHandlers.close();
                                        setSelectedUser(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    // color="green"
                                    loading={activateUserMutation.isPending}
                                    onClick={async () => {
                                        if (selectedUser) {
                                            await activateUserMutation.mutateAsync(
                                                selectedUser.id,
                                            );
                                            activationHandlers.close();
                                            setSelectedUser(null);
                                        }
                                    }}
                                >
                                    Activate
                                </Button>
                            </Group>
                        </Modal>
                    </TableScrollContainer>
                )}

                {/* Pagination */}
                <EntityPagination entity="users" total={data?.total ?? 0} />
            </Paper>
        </PageContainer>
    );
};
export default UsersPage;

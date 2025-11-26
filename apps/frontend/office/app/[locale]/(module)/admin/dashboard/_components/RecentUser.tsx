'use client';

import NoData from '@/components/NoData';
import { Link } from '@/i18n/routing';
import {
    Badge,
    Button,
    Card,
    Divider,
    Flex,
    Group,
    LoadingOverlay,
    Paper,
    Pill,
    Stack,
    Table,
    TableScrollContainer,
    Text,
    Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { entityParamSchema, entityParamSerializer } from '@shega/shared';
import { EntityColumn } from '@shega/ui';
import { IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

import { PageContainer } from '@/components/PageContainer';
import {
    type Daum,
    fetchRecentUsers,
} from 'app/[locale]/_api/users/fetch-user';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { parseAsJson, useQueryState } from 'nuqs';

interface Filters {
    roles: string[];
    status: string;
    sort: { [key: string]: 'asc' | 'desc' };
}

const RecentUsers = () => {
    const t = useTranslations('usersPage');
    const isMobile = useMediaQuery('(max-width: 768px)');

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

    const [entityParams] = useQueryState(
        'users',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: 5,
        }),
    );

    const roles = [
        { value: 'ADMINISTRATOR', label: t('roles.administrator') },
        { value: 'school_admin', label: t('roles.workProvider') },
        { value: 'JOB_SEEKER', label: t('roles.jobSeeker') },
        { value: 'MENTOR', label: t('roles.mentor') },
    ];

    const { data, isLoading, error } = useQuery({
        queryKey: ['users', entityParamSerializer(entityParams)],
        queryFn: () => fetchRecentUsers(entityParamSerializer(entityParams)),
        enabled: !!entityParams,
    });

    if (isLoading) {
        return <LoadingOverlay visible={true} h={'100%'} />;
    }

    if (error) {
        return <Text c="red">{t('error')}</Text>;
    }

    const users = Array.isArray(data) ? data : data?.data || [];

    return (
        <PageContainer className="flex flex-col gap-2.5 mt-10">
            <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
                <Flex justify="space-between" align="center" mb="md">
                    <Title size={20}>Recent Users</Title>
                    <Button
                        component={Link}
                        href="/admin/users"
                        variant="transparent"
                        className="hover:underline"
                    >
                        View more
                    </Button>
                </Flex>

                <Group gap="sm" className="mb-4">
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
                {(() => {
                    if (users.length === 0) {
                        return <NoData />;
                    }

                    if (isMobile) {
                        return (
                            <Stack>
                                {users.map((user: Daum) => {
                                    const createdDate = user.createdDate
                                        ? DateTime.fromJSDate(
                                              new Date(user.createdDate),
                                          ).toFormat('yyyy-MM-dd')
                                        : 'Unknown';
                                    const statusLabel = user.isActive
                                        ? t('status.active')
                                        : t('status.inactive');
                                    const badgeColor = user.isActive
                                        ? 'green'
                                        : 'red';

                                    return (
                                        <Card
                                            key={user.email}
                                            shadow="sm"
                                            p="lg"
                                            radius="md"
                                            withBorder
                                        >
                                            <Flex
                                                justify="space-between"
                                                align="center"
                                            >
                                                <Text fw={500}>
                                                    {user.fullName}
                                                </Text>
                                                <Badge color={badgeColor}>
                                                    {statusLabel}
                                                </Badge>
                                            </Flex>
                                            <Divider my="xs" />
                                            <Text size="sm">{user.email}</Text>
                                            <Text size="xs" c="dimmed">
                                                {createdDate}
                                            </Text>
                                            <Group mt="md">
                                                <Button
                                                    variant="light"
                                                    size="xs"
                                                >
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
                                    );
                                })}
                            </Stack>
                        );
                    }

                    return (
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
                                            {t('table.fullName')}
                                        </Table.Th>
                                        <Table.Th>{t('table.email')}</Table.Th>
                                        <Table.Th>{t('table.role')}</Table.Th>
                                        <Table.Th>
                                            {t('table.createdBy')}
                                        </Table.Th>
                                        <Table.Th>
                                            <EntityColumn
                                                entity="users"
                                                field="createdAt"
                                                label={t('table.createdAt')}
                                            />
                                        </Table.Th>
                                        <Table.Th>{t('table.status')}</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation> */}
                                    {users.map((user: Daum) => {
                                        let roleLabel = 'Job Seeker';
                                        if (
                                            user.role === 'school_admin' ||
                                            user.role === 'PROGRAM_ADMIN'
                                        ) {
                                            roleLabel = 'Employer';
                                        } else if (
                                            user.role === 'ADMINISTRATOR'
                                        ) {
                                            roleLabel = 'Administrator';
                                        } else if (user.role === 'MENTOR') {
                                            roleLabel = 'Mentor';
                                        }

                                        const createdDate = user.createdDate
                                            ? DateTime.fromJSDate(
                                                  new Date(user.createdDate),
                                              ).toFormat('dd-MM-yyyy')
                                            : 'Unknown';
                                        const statusLabel = user.isActive
                                            ? t('status.active')
                                            : t('status.inactive');
                                        const pillClass = `bg-gray-100 ${user.isActive ? 'text-green-600' : 'text-red-600'}`;

                                        return (
                                            <Table.Tr key={user.id}>
                                                <Table.Td>
                                                    {user.fullName}
                                                </Table.Td>
                                                <Table.Td>
                                                    <Link
                                                        href={`mailto:${user.email}`}
                                                        className="hover:underline"
                                                    >
                                                        {user.email}
                                                    </Link>
                                                </Table.Td>
                                                <Table.Td>{roleLabel}</Table.Td>
                                                <Table.Td>
                                                    {user.createdBy}
                                                </Table.Td>
                                                <Table.Td>
                                                    {createdDate}
                                                </Table.Td>
                                                <Table.Td>
                                                    <Pill
                                                        variant="filled"
                                                        className={pillClass}
                                                    >
                                                        {statusLabel}
                                                    </Pill>
                                                </Table.Td>
                                            </Table.Tr>
                                        );
                                    })}
                                </Table.Tbody>
                            </Table>
                        </TableScrollContainer>
                    );
                })()}
            </Paper>
        </PageContainer>
    );
};
export default RecentUsers;

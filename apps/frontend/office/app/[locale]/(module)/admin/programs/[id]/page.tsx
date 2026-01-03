'use client';

import { PageContainer, PageTitle } from '@/components/PageContainer';
import {
    Badge,
    Card,
    Center,
    Group,
    LoadingOverlay,
    Paper,
    Stack,
    Table,
    Tabs,
    Text,
} from '@mantine/core';
import { useAuth } from '@shega/ui';
import { useQuery } from '@tanstack/react-query';
import {
    fetchCalendarYears,
    fetchCalendarYearsSchoolAdmin,
    fetchProgramsById,
    fetchUsers,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useParams } from 'next/navigation';
import { CreateCalendarYear } from '../_components/CreateCalendarYear';
import { CreateUser } from '../_components/CreateUser';

export default function ProgramDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();

    const {
        data: program,
        isLoading: programLoading,
        error: programError,
    } = useQuery({
        queryKey: ['program', id],
        queryFn: () => fetchProgramsById(id),
    });

    // Calendar Years
    const {
        data: years,
        isLoading: yearsLoading,
        refetch: refetchYears,
    } = useQuery({
        queryKey: ['calendarYears', id],
        queryFn: () =>
            user?.role === 'super_admin'
                ? fetchCalendarYears(id)
                : fetchCalendarYearsSchoolAdmin(id),
    });

    // users
    const {
        data: users,
        isLoading: usersLoading,
        refetch: refetchUsers,
    } = useQuery({
        queryKey: ['program', id, 'users'],
        queryFn: () => fetchUsers(id),
    });

    if (yearsLoading || usersLoading) {
        return <LoadingOverlay visible h="100vh" />;
    }

    if (programLoading || !program) {
        return <LoadingOverlay />;
    }

    return (
        <PageContainer>
            <PageTitle>Program Detail</PageTitle>
            {/* 🔹 Program Info Section */}
            <Card shadow="sm" withBorder p="lg" radius="md" mt="md">
                <Stack gap="xs">
                    <Group justify="space-between">
                        <Text fw={600}>Program Name:</Text>
                        <Text>{program?.name}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={600}>Type:</Text>
                        <Text>{program?.programType}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={600}>Description:</Text>
                        <Text>{program?.description}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={600}>Status:</Text>
                        <Text c={program?.isActive ? 'green' : 'red'}>
                            {program?.isActive ? 'Active' : 'Inactive'}
                        </Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={600}>Created By:</Text>
                        <Text>{program?.createdBy}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={600}>Created At:</Text>
                        <Text>{program?.createdAt}</Text>
                    </Group>
                </Stack>
            </Card>

            {/* 🔹 Tabs for Calendar Year + Root Classes */}
            <Paper shadow="xs" p="md" mt="lg" radius="md">
                <Tabs defaultValue="calendarYears">
                    <Tabs.List>
                        <Tabs.Tab value="calendarYears">
                            Calendar Years
                        </Tabs.Tab>
                        {user?.role === 'school_admin' && (
                            <Tabs.Tab value="users">Users</Tabs.Tab>
                        )}
                    </Tabs.List>

                    {/* Calendar Years */}
                    <Tabs.Panel value="calendarYears" pt="sm">
                        <Group
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                            mb="md"
                        >
                            <Text fw={500}>Calendar Years</Text>
                            {user?.role === 'super_admin' && (
                                <CreateCalendarYear programId={program.id} />
                            )}
                        </Group>
                        {years && years.length > 0 ? (
                            <Table striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Name</Table.Th>
                                        <Table.Th>Start Date</Table.Th>
                                        <Table.Th>End Date</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Created By</Table.Th>
                                        <Table.Th>Created At</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                                    {years.map((year: any) => (
                                        <Table.Tr key={year.id}>
                                            <Table.Td>{year.name}</Table.Td>
                                            <Table.Td>
                                                {new Date(
                                                    year.startDate,
                                                ).toLocaleDateString()}
                                            </Table.Td>
                                            <Table.Td>
                                                {new Date(
                                                    year.endDate,
                                                ).toLocaleDateString()}
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge
                                                    color={
                                                        year.isActive
                                                            ? 'green'
                                                            : 'red'
                                                    }
                                                >
                                                    {year.isActive
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                {year.createdBy}
                                            </Table.Td>
                                            <Table.Td>
                                                {new Date(
                                                    year.createdAt,
                                                ).toLocaleDateString()}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        ) : (
                            <Center h={150}>
                                <Text c="dimmed">No calendar years found.</Text>
                            </Center>
                        )}
                    </Tabs.Panel>

                    {/* Users */}
                    {user?.role === 'school_admin' && (
                        <Tabs.Panel value="users" pt="sm">
                            <Group
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                                mb="md"
                            >
                                <Text fw={500}>Users</Text>
                                <CreateUser programId={program.id} />
                            </Group>
                            {users && users.length > 0 ? (
                                <Table striped>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Full Name</Table.Th>
                                            <Table.Th>Email</Table.Th>
                                            <Table.Th>Created By</Table.Th>
                                            <Table.Th>Created At</Table.Th>
                                            <Table.Th>Status</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                                        {users.map((user: any) => (
                                            <Table.Tr key={user.id}>
                                                <Table.Td>{`${user.member.profile.firstName} ${user.member.profile.middleName}`}</Table.Td>
                                                <Table.Td>
                                                    {user.email}
                                                </Table.Td>
                                                <Table.Td>
                                                    {user.createdBy}
                                                </Table.Td>
                                                <Table.Td>
                                                    {new Date(
                                                        user.createdAt,
                                                    ).toLocaleDateString()}
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge
                                                        color={
                                                            user.isActive
                                                                ? 'green'
                                                                : 'red'
                                                        }
                                                    >
                                                        {user.isActive
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                    </Badge>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            ) : (
                                <Center h={150}>
                                    <Text c="dimmed">No users found.</Text>
                                </Center>
                            )}
                        </Tabs.Panel>
                    )}
                </Tabs>
            </Paper>
        </PageContainer>
    );
}

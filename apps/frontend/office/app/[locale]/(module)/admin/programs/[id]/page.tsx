'use client';

import { PageContainer, PageTitle } from '@/components/PageContainer';
import {
    Badge,
    Card,
    Center,
    Divider,
    Flex,
    Group,
    LoadingOverlay,
    Paper,
    Stack,
    Table,
    Tabs,
    Text,
} from '@mantine/core';
import { EntitySearch } from '@shega/ui';
import { useQuery } from '@tanstack/react-query';
import {
    fetchCalendarYears,
    fetchProgramsById,
    fetchCRootClasses as fetchRootClasses,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { CreateCalendarYear } from '../_components/CreateCalendarYear';
import { CreateRootClass } from '../_components/CreateRootClass';

const HeaderSection = () => {
    const t = useTranslations('programsPage');
    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align="center" justify="space-between" className="p-4">
                <Text className="font-bold text-xl">{t('title')}</Text>
                <CreateCalendarYear programId={'12312'} />
            </Flex>
            <Divider my="md" />
            <Group justify="space-between" className="mb-4">
                <EntitySearch
                    entity="mentorship"
                    placeholder={t('searchPlaceholder')}
                    className="!w-[300px]"
                />
            </Group>
        </Paper>
    );
};

export default function ProgramDetailPage() {
    const { id } = useParams<{ id: string }>();

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
        queryFn: () => fetchCalendarYears(id),
    });

    // Root Classes
    const {
        data: rootClasses,
        isLoading: classesLoading,
        refetch: refetchClasses,
    } = useQuery({
        queryKey: ['rootClasses', id],
        queryFn: () => fetchRootClasses(id),
    });

    if (yearsLoading || classesLoading) {
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
                        <Tabs.Tab value="rootClasses">Root Classes</Tabs.Tab>
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
                            <CreateCalendarYear programId={program.id} />
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

                    {/* Root Classes */}
                    <Tabs.Panel value="rootClasses" pt="sm">
                        <Group
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                            mb="md"
                        >
                            <Text fw={500}>Calendar Years</Text>
                            <CreateRootClass programId={program.id} />
                        </Group>
                        {rootClasses && rootClasses.length > 0 ? (
                            <Table striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Name</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Created By</Table.Th>
                                        <Table.Th>Created At</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                                    {rootClasses.map((cls: any) => (
                                        <Table.Tr key={cls.id}>
                                            <Table.Td>{cls.name}</Table.Td>
                                            <Table.Td>
                                                <Badge
                                                    color={
                                                        cls.isActive
                                                            ? 'green'
                                                            : 'red'
                                                    }
                                                >
                                                    {cls.isActive
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>{cls.createdBy}</Table.Td>
                                            <Table.Td>
                                                {new Date(
                                                    cls.createdAt,
                                                ).toLocaleDateString()}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        ) : (
                            <Center h={150}>
                                <Text c="dimmed">No root classes found.</Text>
                            </Center>
                        )}
                    </Tabs.Panel>
                </Tabs>
            </Paper>
        </PageContainer>
    );
}

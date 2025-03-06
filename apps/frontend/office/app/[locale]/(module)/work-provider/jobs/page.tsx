'use client';

import { useRouter } from '@/i18n/routing';
import {
    Badge,
    Button,
    Card,
    Divider,
    Flex,
    Group,
    Menu,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableScrollContainer,
    Text,
    TextInput,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
    IconDotsVertical,
    IconEdit,
    IconPlus,
    IconSearch,
    IconTrash,
} from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useState } from 'react';

const sampleJobs = [
    {
        id: '1',
        title: 'Frontend Developer',
        category: 'Software Development',
        company: 'Herani Tech',
        status: 'open',
        postedAt: '2024-02-15T12:00:00Z',
    },
    {
        id: '2',
        title: 'Project Manager',
        category: 'Management',
        company: 'Meklit Solutions',
        status: 'closed',
        postedAt: '2024-01-20T09:30:00Z',
    },
];

const JobsList = () => {
    const t = useTranslations('jobsPage');
    const isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter();

    const [selection, setSelection] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useQueryState('search', {
        defaultValue: '',
    });
    const [categoryFilter, setCategoryFilter] = useQueryState('filter', {
        defaultValue: '',
    });
    const [sortOrder, setSortOrder] = useQueryState('sort', {
        defaultValue: 'asc',
    });

    const filteredJobs = sampleJobs.filter(
        (job) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (categoryFilter ? job.category === categoryFilter : true),
    );

    const sortedJobs = [...filteredJobs].sort((a, b) =>
        sortOrder === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title),
    );

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id],
        );

    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align="center" justify="space-between" className="p-4">
                <Text className="font-bold text-xl">{t('title')}</Text>
                <Button
                    leftSection={<IconPlus size={18} />}
                    variant="filled"
                    color="blue"
                    onClick={() => router.push('/work-provider/jobs/create')}
                >
                    {t('createJob')}
                </Button>
            </Flex>
            <Divider my="md" />

            <Group justify="space-between" className="mb-4">
                <TextInput
                    leftSection={<IconSearch size={18} />}
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: 300 }}
                />
                <Select
                    placeholder={t('selectCategory')}
                    value={categoryFilter}
                    size="sm"
                    onChange={(data) => setCategoryFilter(data ?? '')}
                    data={[
                        { value: '', label: t('allCategories') },
                        {
                            value: 'Software Development',
                            label: 'Software Development',
                        },
                        { value: 'Management', label: 'Management' },
                    ]}
                    style={{ width: 200 }}
                />
            </Group>

            {isMobile ? (
                <Stack>
                    {sortedJobs.map((job) => (
                        <Card
                            key={job.id}
                            shadow="sm"
                            p="lg"
                            radius="md"
                            withBorder
                        >
                            <Text fw={500}>{job.title}</Text>
                            <Text size="sm" c="dimmed">
                                {job.company}
                            </Text>
                            <Badge
                                color={job.status === 'open' ? 'green' : 'red'}
                            >
                                {job.status}
                            </Badge>
                            <Text size="xs" c="dimmed">
                                {DateTime.fromISO(job.postedAt).toFormat(
                                    'yyyy-MM-dd HH:mm:ss',
                                )}
                            </Text>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <TableScrollContainer minWidth={800} type="native">
                    <Table striped verticalSpacing="md">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Title</Table.Th>
                                <Table.Th>Category</Table.Th>
                                <Table.Th>Company</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Posted At</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {sortedJobs.map((job) => (
                                <Table.Tr key={job.id}>
                                    <Table.Td>{job.title}</Table.Td>
                                    <Table.Td>{job.category}</Table.Td>
                                    <Table.Td>{job.company}</Table.Td>
                                    <Table.Td>
                                        <Badge
                                            color={
                                                job.status === 'open'
                                                    ? 'green'
                                                    : 'red'
                                            }
                                        >
                                            {job.status}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        {DateTime.fromISO(
                                            job.postedAt,
                                        ).toFormat('yyyy-MM-dd HH:mm:ss')}
                                    </Table.Td>
                                    <Table.Td>
                                        <Menu width={150}>
                                            <Menu.Target>
                                                <IconDotsVertical size={18} />
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <MenuItem
                                                    leftSection={
                                                        <IconEdit size={14} />
                                                    }
                                                >
                                                    Edit
                                                </MenuItem>
                                                <MenuItem
                                                    leftSection={
                                                        <IconTrash size={14} />
                                                    }
                                                    color="red"
                                                >
                                                    Delete
                                                </MenuItem>
                                            </Menu.Dropdown>
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

export default JobsList;

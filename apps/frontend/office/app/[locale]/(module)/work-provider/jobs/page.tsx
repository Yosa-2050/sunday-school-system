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
    Pagination,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
    IconDotsVertical,
    IconEdit,
    IconPlus,
    IconSearch,
    IconTrash,
    IconEye,
    IconRefresh,
} from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useState } from 'react';

const sampleJobs = [
    {
        id: '1',
        title: 'Frontend Developer',
        description: 'Develop and maintain web applications.',
        employmentType: 'Full-time',
        category: 'Software Development',
        company: 'Herani Tech',
        salaryRange: '$50k - $70k',
        location: 'Remote',
        status: 'Waiting Approval',
        postedAt: '2024-02-15T12:00:00Z',
    },
    {
        id: '2',
        title: 'Project Manager',
        description: 'Manage and oversee projects from start to finish.',
        employmentType: 'Contract',
        category: 'Management',
        company: 'Meklit Solutions',
        salaryRange: '$60k - $90k',
        location: 'New York',
        status: 'Approved',
        postedAt: '2024-01-20T09:30:00Z',
    },
];

const JobsList = () => {
    const t = useTranslations('jobsListPage');
    const isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5;

    const [searchQuery, setSearchQuery] = useQueryState('search', {
        defaultValue: '',
    });
    const [categoryFilter, setCategoryFilter] = useQueryState('filter', {
        defaultValue: '',
    });

    const filteredJobs = sampleJobs.filter(
        (job) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (categoryFilter ? job.category === categoryFilter : true),
    );

    const paginatedJobs = filteredJobs.slice(
        (currentPage - 1) * jobsPerPage,
        currentPage * jobsPerPage,
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
                    {t('postJob')}
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

            {filteredJobs.length === 0 ? (
                <Text ta="center">You haven’t any posted jobs yet.</Text>
            // biome-ignore lint/nursery/noNestedTernary: <explanation>
            ) : isMobile ? (
                <Stack>
                    {paginatedJobs.map((job) => (
                        <Card key={job.id} shadow="sm" p="lg" radius="md" withBorder>
                            <Text fw={500}>{job.title}</Text>
                            <Text size="sm" c="dimmed">{job.company}</Text>
                            <Badge color={job.status === 'Approved' ? 'green' : 'yellow'}>
                                {job.status}
                            </Badge>
                            <Text size="xs" c="dimmed">
                                {DateTime.fromISO(job.postedAt).toFormat('yyyy-MM-dd HH:mm:ss')}
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
                                <Table.Th>Employment Type</Table.Th>
                                <Table.Th>Salary Range</Table.Th>
                                <Table.Th>Location</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {paginatedJobs.map((job) => (
                                <Table.Tr key={job.id}>
                                    <Table.Td>{job.title}</Table.Td>
                                    <Table.Td>{job.employmentType}</Table.Td>
                                    <Table.Td>{job.salaryRange}</Table.Td>
                                    <Table.Td>{job.location}</Table.Td>
                                    <Table.Td>
                                        <Badge color={job.status === 'Approved' ? 'green' : 'yellow'}>
                                            {job.status}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Menu width={200}>
                                            <Menu.Target>
                                                <IconDotsVertical size={18} />
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <MenuItem leftSection={<IconEdit size={14} />}>Edit</MenuItem>
                                                <MenuItem leftSection={<IconTrash size={14} />} color="red">Close</MenuItem>
                                                <MenuItem leftSection={<IconEye size={14} />}>View Applications</MenuItem>
                                                <MenuItem leftSection={<IconRefresh size={14} />}>Reactivate</MenuItem>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </TableScrollContainer>
            )}

            <Pagination total={Math.ceil(filteredJobs.length / jobsPerPage)} value={currentPage} onChange={setCurrentPage} mt="md" />
        </Paper>
    );
};

export default JobsList;

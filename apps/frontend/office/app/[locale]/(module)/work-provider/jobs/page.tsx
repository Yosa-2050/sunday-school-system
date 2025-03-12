'use client';

import { useRouter } from '@/i18n/routing';
import {
    Badge,
    Button,
    Card,
    Center,
    Divider,
    Flex,
    Group,
    LoadingOverlay,
    Menu,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Stack,
    Table,
    TableScrollContainer,
    Text,
    TextInput,
} from '@mantine/core';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import {
    IconDotsVertical,
    IconEdit,
    IconEye,
    IconPlus,
    IconRefresh,
    IconSearch,
    IconTrash,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from 'app/[locale]/_api/organizations/fetch-jobs';
import parse from 'html-react-parser';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useState } from 'react';

interface Organization {
    id: string;
    name: string;
    isActive: boolean;
}

interface Job {
    id: string;
    title: string;
    description: string;
    type: string;
    salaryFrom: number;
    salaryTo: number;
    status: string;
    organization: Organization;
    postedBy: {
        employee: {
            profile: {
                firstName: string;
                lastName: string;
            };
        };
    };
}

const JobsList = () => {
    const router = useRouter();
    const t = useTranslations('jobsListPage');
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [selection, setSelection] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useQueryState('search', {
        defaultValue: '',
    });
    const [categoryFilter, setCategoryFilter] = useQueryState('category', {
        defaultValue: '',
    });
    const [sortOrder, setSortOrder] = useQueryState('sort', {
        defaultValue: 'asc',
    });
    const [page, setPage] = useQueryState('page', { defaultValue: '1' });
    const [limit, setLimit] = useQueryState('limit', { defaultValue: '10' });

    const [debouncedSearch] = useDebouncedValue(searchQuery, 500);

    const { data, isLoading, error } = useQuery({
        queryKey: ['jobs', debouncedSearch, page, limit, categoryFilter],
        queryFn: () =>
            fetchJobs({
                // status: categoryFilter,
                pagination: {
                    search: debouncedSearch,
                    page: +page,
                    limit: +limit,
                },
            }),
    });

    const jobs = data?.data || [];
    const totalPages = data?.totalPages || 0;

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (error) {
        return <Text color="red">Error loading jobs</Text>;
    }

    const handleEditJob = (jobId: string) => {
        router.push(`/work-provider/jobs/edit/${jobId}`);
    };

    const handleViewApplications = (jobId: string) => {
        router.push(`/work-provider/jobs/${jobId}/applications`);
    };

    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align="center" justify="space-between" className="p-4">
                <Text className="font-bold text-xl">{t('title')}</Text>
                <Button
                    leftSection={<IconPlus size={18} />}
                    variant="filled"
                    color="primary"
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
                    onChange={(value) => setCategoryFilter(value ?? '')}
                    data={[
                        { value: '', label: t('allCategories') },
                        { value: 'FULL_TIME', label: 'Full Time' },
                        { value: 'PART_TIME', label: 'Part Time' },
                        { value: 'CONTRACT', label: 'Contract' },
                        { value: 'INTERNSHIP', label: 'Internship' },
                    ]}
                    style={{ width: 200 }}
                />
            </Group>

            {jobs.length === 0 ? (
                <Center h={200}>
                    <Text c="dimmed" ta="center">
                        You haven&apos;t posted any jobs yet.
                    </Text>
                </Center>
            ) : // biome-ignore lint/nursery/noNestedTernary: <explanation>
            isMobile ? (
                <Stack>
                    {jobs.map((job: Job) => (
                        <Card
                            key={job.id}
                            shadow="sm"
                            p="lg"
                            radius="md"
                            withBorder
                        >
                            <Text fw={500}>{job.title}</Text>
                            <Text size="sm" c="dimmed">
                                {parse(job.description)}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {job.type}
                            </Text>
                            <Text size="sm">
                                Salary: ${job.salaryFrom.toLocaleString()} - $
                                {job.salaryTo.toLocaleString()}
                            </Text>
                            <Badge
                                color={
                                    job.status === 'APPROVED'
                                        ? 'green'
                                        : 'yellow'
                                }
                            >
                                {job.status}
                            </Badge>
                            <Text size="xs" c="dimmed">
                                Posted by:{' '}
                                {job.postedBy.employee.profile.firstName}{' '}
                                {job.postedBy.employee.profile.lastName}
                            </Text>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <TableScrollContainer minWidth={800} type="native">
                    <Table striped verticalSpacing="md">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Job Title</Table.Th>
                                <Table.Th>Employment Type</Table.Th>
                                <Table.Th>Salary Range</Table.Th>
                                <Table.Th>Posting Date</Table.Th>
                                <Table.Th>Location</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {jobs.map((job: Job) => (
                                <Table.Tr key={job.id}>
                                    <Table.Td>{job.title}</Table.Td>
                                    <Table.Td>
                                        {job.type
                                            .split('_')
                                            .map(
                                                (word) =>
                                                    word.charAt(0) +
                                                    word.slice(1).toLowerCase(),
                                            )
                                            .join(' ')}
                                    </Table.Td>
                                    <Table.Td>
                                        ${job.salaryFrom.toLocaleString()} - $
                                        {job.salaryTo.toLocaleString()}
                                    </Table.Td>
                                    <Table.Td>
                                        {new Date().toDateString()}
                                    </Table.Td>
                                    <Table.Td>Location</Table.Td>
                                    <Table.Td>
                                        <Badge
                                            color={
                                                job.status === 'APPROVED'
                                                    ? 'green'
                                                    : 'yellow'
                                            }
                                        >
                                            {job.status}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Menu width={200}>
                                            <Menu.Target>
                                                <IconDotsVertical
                                                    size={18}
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <MenuItem
                                                    leftSection={
                                                        <IconEye size={14} />
                                                    }
                                                    onClick={() =>
                                                        router.push(
                                                            `/work-provider/jobs/${job.id}`,
                                                        )
                                                    }
                                                >
                                                    View
                                                </MenuItem>
                                                <MenuItem
                                                    leftSection={
                                                        <IconEdit size={14} />
                                                    }
                                                    onClick={() =>
                                                        handleEditJob(job.id)
                                                    }
                                                >
                                                    Edit
                                                </MenuItem>
                                                {job.status !== 'CLOSED' && (
                                                    <MenuItem
                                                        leftSection={
                                                            <IconTrash
                                                                size={14}
                                                            />
                                                        }
                                                        color="red"
                                                        // onClick={() => handleDeactivateJob(job.id)}
                                                    >
                                                        Close/Deactivate
                                                    </MenuItem>
                                                )}
                                                {job.status === 'CLOSED' && (
                                                    <MenuItem
                                                        leftSection={
                                                            <IconRefresh
                                                                size={14}
                                                            />
                                                        }
                                                        // onClick={() => handleReactivateJob(job.id)}
                                                    >
                                                        Reactivate
                                                    </MenuItem>
                                                )}
                                                <MenuItem
                                                    leftSection={
                                                        <IconEye size={14} />
                                                    }
                                                    onClick={() =>
                                                        handleViewApplications(
                                                            job.id,
                                                        )
                                                    }
                                                >
                                                    View Applications
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

            <Pagination
                total={totalPages}
                value={+page}
                onChange={(newPage) => setPage(newPage.toString())}
                mt="md"
            />
        </Paper>
    );
};

export default JobsList;

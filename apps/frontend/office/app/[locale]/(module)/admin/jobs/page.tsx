'use client';

import { useRouter } from '@/i18n/routing';
import {
    Badge,
    Button,
    Card,
    Center,
    Checkbox,
    Divider,
    Flex,
    Group,
    LoadingOverlay,
    Paper,
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
import { EntityFilter, EntityPagination, EntitySearch } from '@shega/ui';
import { IconDownload, IconEye } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchJobsAdmin } from 'app/[locale]/_api/admin/fetch-jobs';
import { exportSelectedJobs } from 'app/[locale]/_api/organizations/export-selected-jobs';
import parse from 'html-react-parser';
import { useTranslations } from 'next-intl';
import { parseAsJson, useQueryState } from 'nuqs';
import { useCallback, useState } from 'react';

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
    orgName: string;
    createdDate: string;
    postedBy: {
        employee: {
            profile: {
                firstName: string;
                middleName: string;
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

    const statusStyles = {
        APPROVED: 'bg-green-500',
        DECLINED: 'bg-red-500',
        WAITINGAPPROVAL: 'bg-yellow-500',
    };

    const statusText = {
        APPROVED: 'Approved',
        DECLINED: 'Declined',
        WAITINGAPPROVAL: 'Waiting Approval',
    };

    const [entityParams] = useQueryState(
        'jobs',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: PER_PAGE,
            o: [
                { f: 'program.status', d: 'desc' },
                { f: 'createdAt', d: 'asc' },
            ],
        }),
    );

    const { data, isLoading, error } = useQuery({
        queryKey: ['jobs', entityParamSerializer(entityParams)],
        queryFn: () => fetchJobsAdmin(entityParamSerializer(entityParams)),
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

    const exportMutation = useMutation({
        mutationKey: ['exports'],
        mutationFn: exportSelectedJobs,
        onSuccess: (list) => {
            exportToCsv(list);
        },
        onError: (error) => {
            logger.log(error);
            notifications.show({
                title: 'Export Users',
                message:
                    'Something went wrong while exporting selected Organization',
                color: 'red',
            });
        },
    });

    const jobs = data?.data || [];

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (error) {
        return <Text color="red">Error loading jobs</Text>;
    }

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id],
        );

    const toggleAll = () =>
        setSelection((current) =>
            current.length === jobs.length
                ? []
                : jobs.map((user: Job) => user.id ?? ''),
        );

    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align="center" justify="space-between" className="p-4">
                <Text className="font-bold text-xl">{t('title')}</Text>
            </Flex>
            <Divider my="md" />

            <Group justify="space-between" className="mb-4">
                <EntitySearch
                    entity="jobs"
                    placeholder={t('searchPlaceholder')}
                    className="!w-[300px]"
                />
                <Group>
                    <EntityFilter
                        entity="jobs"
                        filterOptions={[
                            { value: '', label: t('allCategories') },
                            { value: 'FULL_TIME', label: 'Full Time' },
                            { value: 'PART_TIME', label: 'Part Time' },
                            { value: 'Contract', label: 'Contract' },
                            { value: 'Internship', label: 'Internship' },
                        ]}
                        mode="select"
                        field="type"
                    />
                    <EntityFilter
                        entity="jobs"
                        filterOptions={[
                            { value: '', label: 'All Status' },
                            {
                                value: 'WAITINGAPPROVAL',
                                label: 'Waiting for Approval',
                            },
                            { value: 'APPROVED', label: 'Approved' },
                            { value: 'DECLINED', label: 'Declined' },
                        ]}
                        defaultOrder={[
                            { f: 'program.status', d: 'desc' },
                            { f: 'createdAt', d: 'asc' },
                        ]}
                        mode="select"
                        field="program.status"
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
                                selection.length === 0 ? 'filter' : 'selected';
                            exportMutation.mutate({ payload, type });
                        }}
                        loading={exportMutation.isPending}
                    >
                        {t('exportCSV')}
                    </Button>
                </Group>
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
                    {jobs.map((job) => (
                        <Card
                            key={job.id}
                            shadow="sm"
                            p="lg"
                            radius="md"
                            withBorder
                        >
                            <Text fw={500}>{job.title}</Text>
                            <Stack>
                                <div className="job-description">
                                    {parse(job.description)}
                                </div>
                            </Stack>
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
                                <Table.Th>
                                    <Checkbox
                                        onChange={toggleAll}
                                        checked={
                                            selection.length === jobs.length
                                        }
                                        indeterminate={
                                            selection.length > 0 &&
                                            selection.length !== jobs.length
                                        }
                                    />
                                </Table.Th>
                                <Table.Th>Organization Name</Table.Th>
                                <Table.Th>Job Title</Table.Th>
                                <Table.Th>Created Date</Table.Th>
                                <Table.Th>Salary</Table.Th>
                                <Table.Th>Salary Type</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {jobs.map((job) => (
                                <Table.Tr key={job.id}>
                                    <Table.Td>
                                        <Checkbox
                                            checked={selection.includes(
                                                job.id ?? '',
                                            )}
                                            onChange={() =>
                                                toggleRow(job.id ?? '')
                                            }
                                        />
                                    </Table.Td>
                                    <Table.Td>{job?.orgName}</Table.Td>
                                    <Table.Td
                                        style={{ maxWidth: '200px' }}
                                        title={job.title}
                                    >
                                        {job.title.length > 15
                                            ? `${job.title.substring(0, 15)}...`
                                            : job.title}
                                    </Table.Td>
                                    <Table.Td>
                                        {new Date(
                                            job.createdDate,
                                        ).toDateString()}
                                    </Table.Td>
                                    <Table.Td>
                                        {(() => {
                                            if (
                                                job?.salaryFrom &&
                                                job?.salaryTo
                                            ) {
                                                return `${job.salaryFrom.toLocaleString()} - ${job.salaryTo.toLocaleString()} ${job.currency}`;
                                            }
                                            if (job?.salaryFrom) {
                                                return `${job.salaryFrom.toLocaleString()} ${job.currency}`;
                                            }
                                            return 'N/A';
                                        })()}
                                    </Table.Td>
                                    <Table.Td>{job.salaryType}</Table.Td>
                                    <Table.Td>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                statusStyles[
                                                    job.status as keyof typeof statusStyles
                                                ] || 'bg-yellow-300'
                                            } text-white`}
                                            autoCapitalize="none"
                                        >
                                            {statusText[
                                                job.status as keyof typeof statusText
                                            ] || job.status}
                                        </span>
                                    </Table.Td>
                                    <Table.Td>
                                        <Button
                                            variant="transparent"
                                            leftSection={<IconEye size={14} />}
                                            onClick={() =>
                                                router.push(
                                                    `/admin/jobs/${job.id}`,
                                                )
                                            }
                                            className="py-0 my-0"
                                        >
                                            Details
                                        </Button>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </TableScrollContainer>
            )}

            <EntityPagination
                entity="jobs"
                total={data?.total ?? 0}
                defaultSorting={{
                    o: [
                        { f: 'status', d: 'desc' },
                        { f: 'createdAt', d: 'asc' },
                    ],
                }}
            />
        </Paper>
    );
};

export default JobsList;

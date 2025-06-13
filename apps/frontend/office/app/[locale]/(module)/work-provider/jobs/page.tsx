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
    Paper,
    Stack,
    Table,
    TableScrollContainer,
    Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
    PER_PAGE,
    entityParamSchema,
    entityParamSerializer,
} from '@shega/shared';
import { EntityFilter, EntityPagination, EntitySearch } from '@shega/ui';
import {
    IconDotsVertical,
    IconEdit,
    IconEye,
    IconPlus,
    IconTrash,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from 'app/[locale]/_api/organizations/fetch-jobs';
import parse from 'html-react-parser';
import { useTranslations } from 'next-intl';
import { parseAsJson, useQueryState } from 'nuqs';

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
    createdDate: string;
    currency: string;
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

    const [entityParams] = useQueryState(
        'jobs',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: PER_PAGE,
            o: [{ f: 'createdAt', d: 'desc' }],
        }),
    );

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

    const { data, isLoading, error } = useQuery({
        queryKey: ['jobs', entityParamSerializer(entityParams)],
        queryFn: () => fetchJobs(entityParamSerializer(entityParams)),
    });

    const jobs = data?.data || [];

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (error) {
        return <Text color="red">Error loading jobs</Text>;
    }

    const handleEditJob = (jobId: string) => {
        router.push(`/work-provider/draft-jobs/${jobId}`);
    };

    const handleViewApplications = (jobId: string) => {
        router.push(`/work-provider/jobs/${jobId}/applications`);
    };

    return (
        <Flex direction="column" gap={20}>
            <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
                <Flex align="center" justify="space-between" className="p-4">
                    <Text className="font-bold text-xl">{t('title')}</Text>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        variant="filled"
                        color="primary"
                        onClick={() =>
                            router.push('/work-provider/jobs/create')
                        }
                    >
                        {t('postJob')}
                    </Button>
                </Flex>
                <Divider my="md" />

                <Group justify="space-between" className="mb-4">
                    <EntitySearch
                        entity="jobs"
                        placeholder={t('searchPlaceholder')}
                        className="!w-[300px]"
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
                        mode="select"
                        field="program.status"
                    />
                </Group>
            </Paper>
            <Paper>
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
                                <Text size="sm" c="dimmed">
                                    {parse(job.description)}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    {job.type}
                                </Text>
                                <Text size="sm">
                                    Salary: ${job.salaryFrom.toLocaleString()} -
                                    ${job.salaryTo.toLocaleString()}
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
                        <Table striped>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Job Title</Table.Th>
                                    <Table.Th>Employment Type</Table.Th>
                                    <Table.Th>Salary Range</Table.Th>
                                    <Table.Th>Salary Type</Table.Th>
                                    <Table.Th>Created Date</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {jobs.map((job, index) => (
                                    <Table.Tr key={job.id}>
                                        <Table.Td
                                            style={{ maxWidth: '200px' }}
                                            title={job.title}
                                        >
                                            {job.title.length > 15
                                                ? `${job.title.substring(0, 15)}...`
                                                : job.title}
                                        </Table.Td>
                                        <Table.Td>
                                            {job.type
                                                ?.split('_')
                                                .map(
                                                    (word) =>
                                                        word.charAt(0) +
                                                        word
                                                            .slice(1)
                                                            .toLowerCase(),
                                                )
                                                .join(' ')}
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
                                            {new Date(
                                                job.createdDate,
                                            ).toDateString()}
                                        </Table.Td>

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
                                            {/* <Button
                                            variant="transparent"
                                            className="py-0 my-0"
                                            leftSection={<IconEye size={14} />}
                                            onClick={() =>
                                                router.push(
                                                    `/work-provider/jobs/${job.id}`,
                                                )
                                            }
                                        >
                                            View
                                        </Button> */}
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
                                                            <IconEye
                                                                size={14}
                                                            />
                                                        }
                                                        onClick={() =>
                                                            router.push(
                                                                `/work-provider/jobs/${job.id}`,
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </MenuItem>
                                                    {(job.status ===
                                                        'WAITINGAPPROVAL' ||
                                                        job.status ===
                                                            'Declined') && (
                                                        <MenuItem
                                                            leftSection={
                                                                <IconEdit
                                                                    size={14}
                                                                />
                                                            }
                                                            onClick={() =>
                                                                handleEditJob(
                                                                    job.id,
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </MenuItem>
                                                    )}

                                                    {/* {job.status !== "CLOSED" && (
                            <MenuItem
                              leftSection={<IconTrash size={14} />}
                              color="red"
                              // onClick={() => handleDeactivateJob(job.id)}
                            >
                              Close/Deactivate
                            </MenuItem>
                          )}
                          {job.status === "CLOSED" && (
                            <MenuItem
                              leftSection={<IconRefresh size={14} />}
                              // onClick={() => handleReactivateJob(job.id)}
                            >
                              Reactivate
                            </MenuItem>
                          )} */}

                                                    <MenuItem
                                                        leftSection={
                                                            <IconTrash
                                                                size={14}
                                                            />
                                                        }
                                                        color="red"
                                                        // onClick={() => handleDeactivateJob(job.id)}
                                                    >
                                                        Delete
                                                    </MenuItem>
                                                    {job.status ===
                                                        'Approved' && (
                                                        <MenuItem
                                                            leftSection={
                                                                <IconEye
                                                                    size={14}
                                                                />
                                                            }
                                                            onClick={() =>
                                                                handleViewApplications(
                                                                    job.id,
                                                                )
                                                            }
                                                        >
                                                            View Applications
                                                        </MenuItem>
                                                    )}
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </TableScrollContainer>
                )}

                <EntityPagination entity="jobs" total={data?.total ?? 0} />
            </Paper>
        </Flex>
    );
};

export default JobsList;

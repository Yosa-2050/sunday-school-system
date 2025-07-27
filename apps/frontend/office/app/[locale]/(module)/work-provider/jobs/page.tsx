'use client';

import { useRouter } from '@/i18n/routing';
import {
    Anchor,
    Badge,
    Blockquote,
    Button,
    Card,
    Center,
    Divider,
    Flex,
    Group,
    LoadingOverlay,
    Menu,
    MenuItem,
    Modal,
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
} from '@shega/shared';
import { EntityFilter, EntityPagination, EntitySearch } from '@shega/ui';
import {
    IconDotsVertical,
    IconEdit,
    IconEye,
    IconInfoCircle,
    IconPlus,
    IconTrash,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteJob } from 'app/[locale]/_api/organizations/deleteJob';
import { fetchJobs } from 'app/[locale]/_api/organizations/fetch-jobs';
import { getOrganizationById } from 'app/[locale]/_api/organizations/get-organizationbyId';
import { getCookie } from 'cookies-next';
import parse from 'html-react-parser';
import { useTranslations } from 'next-intl';
import { parseAsJson, useQueryState } from 'nuqs';
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
    const [modalOpened, setModalOpened] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const organizationId = getCookie('organization_id')?.toString();

    const { data: organization, isLoading: orgLoading } = useQuery({
        queryKey: ['organization_id', organizationId],
        queryFn: () => getOrganizationById(organizationId ?? ''),
        enabled: !!organizationId,
    });
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

    const { mutate: deleteJobMutation } = useMutation({
        mutationFn: async (jobId: string) => {
            const response = await deleteJob(jobId);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            setModalOpened(false);
            notifications.show({
                title: 'Job Deletion',
                message: 'The job has been successfully deleted.',
                color: 'green',
            });
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'An error occurred while deleting the job.',
                color: 'red',
            });
        },
    });

    const jobs = data?.data || [];
    const handleDelete = () => {
        if (selectedJobId) {
            deleteJobMutation(selectedJobId);
        }
    };

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
                    {organization?.status === 'APPROVED' && (
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
                    )}
                </Flex>
                {organization?.status !== 'APPROVED' && (
                    <Blockquote color="blue" icon={<IconInfoCircle />} mb="lg">
                        <Text size="sm">
                            Welcome! To ensure a quality experience for all, you
                            won't be able to post jobs until your account is
                            approved. To initiate this, please{' '}
                            <Anchor href="/work-provider/profile" color="blue">
                                edit your employer profile
                            </Anchor>{' '}
                            and submit it for admin review. We'll notify you
                            once it's approved.
                        </Text>
                    </Blockquote>
                )}

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
                    <Stack gap="md">
                        {jobs.map((job) => (
                            <Card
                                key={job.id}
                                shadow="md"
                                p="lg"
                                radius="lg"
                                withBorder
                                style={{
                                    transition:
                                        'transform 0.2s ease, box-shadow 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        'translateY(-3px)';
                                    e.currentTarget.style.boxShadow =
                                        '0 8px 20px rgba(0,0,0,0.08)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                        'translateY(0)';
                                    e.currentTarget.style.boxShadow =
                                        'var(--mantine-shadow-md)';
                                }}
                            >
                                <Stack gap="xs">
                                    <Text fw={700} size="lg" truncate>
                                        {job.title}
                                    </Text>

                                    <Text size="sm" c="dimmed" lineClamp={3}>
                                        {parse(job.description)}
                                    </Text>

                                    <Group
                                        justify="space-between"
                                        align="center"
                                    >
                                        <Badge
                                            size="sm"
                                            variant="light"
                                            color={
                                                job.status === 'APPROVED'
                                                    ? 'green'
                                                    : 'yellow'
                                            }
                                        >
                                            {job.status}
                                        </Badge>
                                        <Text size="xs" c="dimmed">
                                            {job.type}
                                        </Text>
                                    </Group>

                                    <Text size="sm" fw={500}>
                                        Salary: {(() => {
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
                                    </Text>

                                    <Text size="xs" c="dimmed">
                                        Posted:{' '}
                                        {new Date(
                                            job.createdDate,
                                        ).toDateString()}
                                    </Text>
                                </Stack>
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
                                                        onClick={() => {
                                                            setSelectedJobId(
                                                                job.id,
                                                            );
                                                            setModalOpened(
                                                                true,
                                                            );
                                                        }}
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
                                            <Modal
                                                opened={modalOpened}
                                                onClose={() =>
                                                    setModalOpened(false)
                                                }
                                                title="Confirm Deletion"
                                                centered
                                            >
                                                <Text>
                                                    Are you sure you want to
                                                    delete this Job?
                                                </Text>
                                                <Group
                                                    justify="center"
                                                    style={{ marginTop: 20 }}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            setModalOpened(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        No
                                                    </Button>
                                                    <Button
                                                        color="red"
                                                        onClick={handleDelete}
                                                    >
                                                        Yes
                                                    </Button>
                                                </Group>
                                            </Modal>
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

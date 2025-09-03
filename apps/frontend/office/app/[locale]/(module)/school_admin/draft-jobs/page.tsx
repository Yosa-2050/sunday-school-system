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
import { IconPencil } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDraftJobs } from 'app/[locale]/_api/organizations/fetch-draft-jobs';
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
    const t = useTranslations('draftListPage');
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [entityParams] = useQueryState(
        'jobs',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: PER_PAGE,
            o: [{ f: 'createdAt', d: 'desc' }],
            f: [{ f: 'program.isPublished', v: 'false', o: 'eq' }],
        }),
    );

    const { data, isLoading, error } = useQuery({
        queryKey: ['jobs', entityParamSerializer(entityParams)],
        queryFn: () => fetchDraftJobs(entityParamSerializer(entityParams)),
    });

    const jobs = data?.data || [];

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (error) {
        return <Text color="red">Error loading jobs</Text>;
    }

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
                    field="status"
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
                                <Table.Th>Created Date</Table.Th>
                                <Table.Th>Location</Table.Th>
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
                                                    word.slice(1).toLowerCase(),
                                            )
                                            .join(' ')}
                                    </Table.Td>
                                    <Table.Td>
                                        {job.salaryFrom?.toLocaleString()} -
                                        {job.salaryTo?.toLocaleString()}{' '}
                                        {job?.currency}
                                    </Table.Td>
                                    <Table.Td>
                                        {new Date(
                                            job.createdDate,
                                        ).toDateString()}
                                    </Table.Td>
                                    <Table.Td>Location</Table.Td>
                                    <Table.Td>
                                        <Button
                                            variant="transparent"
                                            className="py-0 my-0"
                                            leftSection={
                                                <IconPencil size={14} />
                                            }
                                            onClick={() =>
                                                router.push(
                                                    `/school_admin/draft-jobs/${job.id}`,
                                                )
                                            }
                                        >
                                            edit
                                        </Button>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </TableScrollContainer>
            )}

            <EntityPagination entity="jobs" total={data?.total ?? 0} />
        </Paper>
    );
};

export default JobsList;

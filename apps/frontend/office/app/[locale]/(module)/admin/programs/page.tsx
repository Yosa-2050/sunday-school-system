'use client';

import { PageContainer, PageTitle } from '@/components/PageContainer';
import { useRouter } from '@/i18n/routing';
import {
    Badge,
    Button,
    Card,
    Center,
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
import { IconEye } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchMentorships } from 'app/[locale]/_api/admin/fetch-mentorship';
import parse from 'html-react-parser';
import { useTranslations } from 'next-intl';
import { parseAsJson, useQueryState } from 'nuqs';

const JobsList = () => {
    const router = useRouter();
    const t = useTranslations('mentorsPage');
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [entityParams] = useQueryState(
        'mentorships',
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
        queryKey: ['mentorships', entityParamSerializer(entityParams)],
        queryFn: () => fetchMentorships(entityParamSerializer(entityParams)),
    });

    const jobs = data?.data || [];

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (error) {
        return <Text color="red">Error loading Mentorships</Text>;
    }

    return (
        <PageContainer className="flex flex-col gap-2.5">
            <Paper shadow="xs" p="sm" style={{ borderRadius: '10px' }}>
                <PageTitle>List of Mentorship Programs</PageTitle>

                <Group justify="space-between" className="my-4">
                    <EntitySearch
                        entity="mentorships"
                        placeholder={t('searchPlaceholder')}
                        className="!w-[300px]"
                    />
                    <EntityFilter
                        entity="mentorships"
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
            </Paper>
            <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
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
                                <Text fw={500}>{job.program.title}</Text>
                                <Text size="sm" c="dimmed">
                                    {parse(job.program.description)}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    {job.program.numberOfApplicants}
                                </Text>
                                <Badge
                                    color={
                                        job.program.status === 'APPROVED'
                                            ? 'green'
                                            : 'yellow'
                                    }
                                >
                                    {job.program.status}
                                </Badge>
                            </Card>
                        ))}
                    </Stack>
                ) : (
                    <TableScrollContainer minWidth={800} type="native">
                        <Table striped>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Program Title</Table.Th>
                                    <Table.Th>Work Place</Table.Th>
                                    <Table.Th>Educational Requirement</Table.Th>
                                    <Table.Th>Experience</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {jobs.map((job, index) => (
                                    <Table.Tr key={job.id}>
                                        <Table.Td
                                            style={{ maxWidth: '200px' }}
                                            title={job.program.title}
                                        >
                                            {job.program.title.length > 15
                                                ? `${job.program.title.substring(0, 15)}...`
                                                : job.program.title}
                                        </Table.Td>
                                        <Table.Td>
                                            {job.program.workPlace}
                                        </Table.Td>
                                        <Table.Td>
                                            {job.program.educationalRequirment}
                                        </Table.Td>
                                        <Table.Td>
                                            {job.program.experiance}
                                        </Table.Td>

                                        <Table.Td>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    statusStyles[
                                                        job.program
                                                            .status as keyof typeof statusStyles
                                                    ] || 'bg-yellow-300'
                                                } text-white`}
                                                autoCapitalize="none"
                                            >
                                                {statusText[
                                                    job.program
                                                        .status as keyof typeof statusText
                                                ] || job.program.status}
                                            </span>
                                        </Table.Td>
                                        <Table.Td>
                                            <Button
                                                variant="transparent"
                                                className="py-0 my-0"
                                                leftSection={
                                                    <IconEye size={14} />
                                                }
                                                onClick={() =>
                                                    router.push(
                                                        `programs/${job.program.id}`,
                                                    )
                                                }
                                            >
                                                View
                                            </Button>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </TableScrollContainer>
                )}

                <EntityPagination
                    entity="mentorships"
                    total={data?.total ?? 0}
                />
            </Paper>
        </PageContainer>
    );
};

export default JobsList;

import { EntityPageLoading } from '@/components/EntityPageLoading';
import { EntityPagination } from '@/components/EntityPagination';
import NoData from '@/components/NoData';
import { Avatar, Button, Paper, Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { fetchRejected } from 'app/[locale]/_api/organizations/fetch-jobs';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';

export const RejectedList = ({
    jobId,
    search,
}: { jobId: string; search: string }) => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { data: applicants, isLoading } = useQuery({
        queryKey: ['applicants', 'rejected', jobId, search],
        queryFn: () =>
            fetchRejected(
                { status: '', pagination: { page: page, limit: 10, search } },
                jobId,
            ),
    });

    if (isLoading) {
        <EntityPageLoading />;
    }
    if (!applicants?.data?.length) {
        return <NoData />;
    }
    return (
        <Paper withBorder radius="md" p={'md'}>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Avatar</Table.Th>
                        <Table.Th>Candidate</Table.Th>
                        <Table.Th>Rejected Date</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {applicants.data?.map(
                        (
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                            applicant: any,
                            index: number,
                        ) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            <Table.Tr key={index}>
                                <Table.Td>
                                    <Avatar>{applicant?.initial}</Avatar>
                                </Table.Td>
                                <Table.Td>
                                    <Text fw={500}>
                                        {`${applicant?.firstName} 
                                                    ${applicant?.lastName}`}
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" c="dimmed">
                                        {
                                            applicant?.dateOfApplicaton.split(
                                                'T',
                                            )[0]
                                        }
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">
                                        {applicant?.applicationStatus}
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Button
                                        variant="transparent"
                                        onClick={() =>
                                            router.push(
                                                `/work-provider/applicants/${applicant?.id}`,
                                            )
                                        }
                                    >
                                        Detail
                                    </Button>
                                </Table.Td>
                            </Table.Tr>
                        ),
                    )}
                </Table.Tbody>
                <EntityPagination
                    total={applicants.total}
                    createPageURL={(p: number) => setPage(p)}
                    perPage={10}
                />
            </Table>
        </Paper>
    );
};

import NoData from '@/components/NoData';
import {
    Avatar,
    Box,
    Button,
    Card,
    Group,
    LoadingOverlay,
    Table,
    Text,
    Title,
} from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchApplicants } from 'app/[locale]/_api/organizations/fetch-jobs';
import { useRouter } from 'next-nprogress-bar';

export const Applicants = ({
    jobId,
    search,
}: { jobId: string; search: string }) => {
    const router = useRouter();
    const { data: applicants, isLoading } = useQuery({
        queryKey: ['applicants', jobId, search],
        queryFn: () =>
            fetchApplicants(
                { status: '', pagination: { page: 1, limit: 5, search } },
                jobId,
            ),
    });

    if (isLoading) {
        <LoadingOverlay />;
    }
    if (!applicants?.data?.length) {
        return <NoData />;
    }
    return (
        <Card withBorder radius="md" p={'md'}>
            <Card.Section withBorder p="md" bg="gray.0">
                <Group justify="space-between">
                    <Group>
                        <IconUsers size={20} />
                        <Title order={2}>Applicants</Title>
                    </Group>
                </Group>
                <Text c="gray.6">Candidates who applied for this position</Text>
            </Card.Section>
            <Card.Section withBorder mb={'sm'}>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Avatar</Table.Th>
                            <Table.Th>Candidate</Table.Th>
                            <Table.Th>Applied Date</Table.Th>
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
                                                    ' ' 
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
                                                    `/work-provider/applicants/${jobId}/${applicant?.id}`,
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
                </Table>
            </Card.Section>
            {applicants?.totall > 5 && (
                <Box className="flex items-center justify-end mt-4">
                    <Button
                        variant="transparent"
                        onClick={() =>
                            router.push(`/work-provider/applicants/${jobId}`)
                        }
                    >
                        Load More
                    </Button>
                </Box>
            )}
        </Card>
    );
};

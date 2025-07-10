'use client';

import { EntityPageLoading } from '@/components/EntityPageLoading';
import { EntityPagination } from '@/components/EntityPagination';
import NoData from '@/components/NoData';
import {
    Avatar,
    Badge,
    Button,
    Checkbox,
    Paper,
    Table,
    Text,
} from '@mantine/core';
import type { Result } from 'app/[locale]/_api/organizations/fetch-jobs';
import { useRouter } from 'next-nprogress-bar';

interface Props {
    applicants?: Result;
    isLoading: boolean;
    isFetching: boolean;
    selectedApplicants: string[];
    setSelectedApplicants: React.Dispatch<React.SetStateAction<string[]>>;
    onShortlist: () => void;
    isShortlisting: boolean;
    page: number;
    setPage: (val: number) => void;
}

export const ApplicantsTable = ({
    applicants,
    isLoading,
    isFetching,
    selectedApplicants,
    setSelectedApplicants,
    onShortlist,
    isShortlisting,
    page,
    setPage,
}: Props) => {
    const router = useRouter();

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = applicants?.data?.map((a) => a.applicationId) || [];
            setSelectedApplicants(allIds);
        } else {
            setSelectedApplicants([]);
        }
    };

    const handleSelectApplicant = (id: string, checked: boolean) => {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        setSelectedApplicants((prev: string[]) =>
            checked ? [...prev, id] : prev.filter((v: string) => v !== id),
        );
    };

    if (isLoading || isFetching) {
        return <EntityPageLoading />;
    }

    if (!applicants?.data?.length) {
        return <NoData />;
    }

    return (
        <Paper withBorder radius="md" p="md">
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>
                            <Checkbox
                                checked={
                                    selectedApplicants.length ===
                                    applicants.data.length
                                }
                                indeterminate={
                                    selectedApplicants.length > 0 &&
                                    selectedApplicants.length <
                                        applicants.data.length
                                }
                                onChange={(e) =>
                                    handleSelectAll(e.currentTarget.checked)
                                }
                            />
                        </Table.Th>
                        <Table.Th>Avatar</Table.Th>
                        <Table.Th>Candidate</Table.Th>
                        <Table.Th>Applied Date</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {applicants.data.map((applicant) => (
                        <Table.Tr key={applicant.applicationId}>
                            <Table.Td>
                                <Checkbox
                                    checked={selectedApplicants.includes(
                                        applicant.applicationId,
                                    )}
                                    onChange={(e) =>
                                        handleSelectApplicant(
                                            applicant.applicationId,
                                            e.currentTarget.checked,
                                        )
                                    }
                                />
                            </Table.Td>
                            <Table.Td>
                                <Avatar>
                                    {(applicant.firstName?.[0] || '') +
                                        (applicant.lastName?.[0] || '')}
                                </Avatar>
                            </Table.Td>
                            <Table.Td>
                                <Text fw={500}>
                                    {applicant.firstName} {applicant.lastName}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text size="sm" c="dimmed">
                                    {applicant.dateOfApplicaton?.split('T')[0]}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Badge
                                    variant="light"
                                    color={
                                        applicant.applicationStatus ===
                                        'PENDING'
                                            ? 'yellow'
                                            : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                              applicant.applicationStatus ===
                                                'SHORTLISTED'
                                              ? 'blue'
                                              : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                applicant.applicationStatus ===
                                                  'HIRED'
                                                ? 'green'
                                                : 'red'
                                    }
                                >
                                    {applicant.applicationStatus}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                <Button
                                    variant="transparent"
                                    onClick={() =>
                                        router.push(
                                            `/work-provider/applicants/${applicant.applicantId}`,
                                        )
                                    }
                                >
                                    Detail
                                </Button>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>

            <EntityPagination
                total={applicants.total}
                createPageURL={setPage}
                perPage={10}
            />
        </Paper>
    );
};

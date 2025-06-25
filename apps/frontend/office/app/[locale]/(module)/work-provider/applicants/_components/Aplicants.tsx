'use client';

import { EntityPageLoading } from '@/components/EntityPageLoading';
import { EntityPagination } from '@/components/EntityPagination';
import NoData from '@/components/NoData';
import {
    Avatar,
    Badge,
    Button,
    Checkbox,
    Grid,
    Group,
    NumberInput,
    Paper,
    Select,
    Stack,
    Table,
    Text,
} from '@mantine/core';
import { IconFilter, IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from 'app/[locale]/_api/job-details';
import { useShortLIstMutation } from 'app/[locale]/_api/job-seeker';
import { fetchApplicants } from 'app/[locale]/_api/organizations/fetch-jobs';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';

interface Filters {
    status: string;
    experience: number | '';
    category: string;
    gender: string;
    ageTo: number | '';
    ageFrom: number | '';
}

const cleanFilters = (filters: Filters) => {
    return Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== ''),
    );
};

export const Applicants = ({
    jobId,
    search,
}: { jobId: string; search: string }) => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        status: '',
        experience: '',
        category: '',
        gender: '',
        ageTo: '',
        ageFrom: '',
    });

    const { mutate: shortlistMutation, isPending: isShortlisting } =
        useShortLIstMutation(jobId);

    const {
        data: applicants,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ['applicants', jobId, search, 'PENDING', filters, page],
        queryFn: () =>
            fetchApplicants(
                {
                    ...cleanFilters(filters),
                    status: '',
                    pagination: {
                        page: page,
                        limit: 10,
                        search,
                        status: filters.status,
                    },
                },
                jobId,
                'PENDING',
            ),
    });

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds =
                applicants?.data?.map(
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    (applicant: any) => applicant.applicantId,
                ) || [];
            setSelectedApplicants(allIds);
        } else {
            setSelectedApplicants([]);
        }
    };

    const handleSelectApplicant = (applicantId: string, checked: boolean) => {
        if (checked) {
            setSelectedApplicants((prev) => [...prev, applicantId]);
        } else {
            setSelectedApplicants((prev) =>
                prev.filter((id) => id !== applicantId),
            );
        }
    };

    const handleShortlist = async () => {
        if (selectedApplicants.length > 0) {
            await shortlistMutation({
                applicants: selectedApplicants,
            });
            setSelectedApplicants([]); // Clear selection after shortlisting
            setShowFilters(false); // Optionally hide filters after action
        }
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            experience: '',
            category: '',
            gender: '',
            ageTo: '',
            ageFrom: '',
        });
    };

    const hasActiveFilters = Object.values(filters).some(
        (value) => value !== '',
    );

    return (
        <Stack gap="md">
            {/* Filter Section */}
            <Paper withBorder radius="md" p="md">
                <Group justify="space-between" mb={showFilters ? 'md' : 0}>
                    <Group>
                        <Button
                            variant="light"
                            leftSection={<IconFilter size={16} />}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            Filters
                        </Button>
                        {hasActiveFilters && (
                            <Badge variant="filled" color="blue">
                                {
                                    Object.values(filters).filter(
                                        (v) => v !== '',
                                    ).length
                                }{' '}
                                active
                            </Badge>
                        )}
                    </Group>

                    {selectedApplicants.length > 0 && (
                        <Group>
                            <Text size="sm" c="dimmed">
                                {selectedApplicants.length} selected
                            </Text>
                            <Button
                                size="sm"
                                loading={isShortlisting}
                                onClick={handleShortlist}
                            >
                                Shortlist Selected
                            </Button>
                        </Group>
                    )}
                </Group>

                {showFilters && (
                    <Stack gap="md">
                        <Grid>
                            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                                <Select
                                    label="Gender"
                                    placeholder="Select gender"
                                    value={filters.gender}
                                    onChange={(value) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            gender: value || '',
                                        }))
                                    }
                                    data={[
                                        { value: 'MALE', label: 'Male' },
                                        { value: 'FEMALE', label: 'Female' },
                                        { value: 'OTHER', label: 'Other' },
                                    ]}
                                    clearable
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                                <Select
                                    label="Category"
                                    placeholder="Select category"
                                    value={filters.category}
                                    onChange={(value) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            category: value || '',
                                        }))
                                    }
                                    data={categories.map((category) => ({
                                        value: category.id,
                                        label: category.name,
                                    }))}
                                    clearable
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                                <NumberInput
                                    label="Experience (years)"
                                    placeholder="Minimum experience"
                                    value={filters.experience}
                                    onChange={(value) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            experience:
                                                typeof value === 'number' &&
                                                !Number.isNaN(value)
                                                    ? value
                                                    : '',
                                        }))
                                    }
                                    min={0}
                                    max={50}
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                                <NumberInput
                                    label="Age From"
                                    placeholder="Minimum age"
                                    value={filters.ageFrom}
                                    onChange={(value) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            ageFrom:
                                                typeof value === 'number' &&
                                                !Number.isNaN(value)
                                                    ? value
                                                    : '',
                                        }))
                                    }
                                    min={18}
                                    max={100}
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                                <NumberInput
                                    label="Age To"
                                    placeholder="Maximum age"
                                    value={filters.ageTo}
                                    onChange={(value) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            ageTo:
                                                typeof value === 'number' &&
                                                !Number.isNaN(value)
                                                    ? value
                                                    : '',
                                        }))
                                    }
                                    min={18}
                                    max={100}
                                />
                            </Grid.Col>
                        </Grid>

                        {hasActiveFilters && (
                            <Group>
                                <Button
                                    variant="light"
                                    color="red"
                                    size="sm"
                                    leftSection={<IconX size={14} />}
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                </Button>
                            </Group>
                        )}
                    </Stack>
                )}
            </Paper>

            {/* Table Section */}

            {/* biome-ignore lint/nursery/noNestedTernary: <explanation> */}
            {isLoading || isFetching ? (
                <EntityPageLoading />
                // biome-ignore lint/nursery/noNestedTernary: <explanation>
            ) : applicants?.data?.length ? (
                <Paper withBorder radius="md" p="md">
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>
                                    <Checkbox
                                        checked={
                                            selectedApplicants.length ===
                                            applicants?.data?.length
                                        }
                                        indeterminate={
                                            selectedApplicants.length > 0 &&
                                            selectedApplicants.length <
                                                applicants?.data?.length
                                        }
                                        onChange={(event) =>
                                            handleSelectAll(
                                                event.currentTarget.checked,
                                            )
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
                            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                            {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation> */}
                            {applicants.data?.map(
                                // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
                                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                (applicant: any, index: number) => (
                                    <Table.Tr
                                        key={applicant.applicationId || index}
                                    >
                                        <Table.Td>
                                            <Checkbox
                                                checked={selectedApplicants.includes(
                                                    applicant.applicationId,
                                                )}
                                                onChange={(event) =>
                                                    handleSelectApplicant(
                                                        applicant.applicationId,
                                                        event.currentTarget
                                                            .checked,
                                                    )
                                                }
                                            />
                                        </Table.Td>
                                        <Table.Td>
                                            <Avatar>
                                                {applicant?.initial}
                                            </Avatar>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text
                                                fw={500}
                                            >{`${applicant?.firstName} ${applicant?.lastName}`}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="dimmed">
                                                {
                                                    applicant?.dateOfApplicaton?.split(
                                                        'T',
                                                    )[0]
                                                }
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge
                                                variant="light"
                                                color={
                                                    applicant?.applicationStatus ===
                                                    'PENDING'
                                                        ? 'yellow'
                                                        : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                          applicant?.applicationStatus ===
                                                            'SHORTLISTED'
                                                          ? 'blue'
                                                          : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                            applicant?.applicationStatus ===
                                                              'HIRED'
                                                            ? 'green'
                                                            : 'red'
                                                }
                                            >
                                                {applicant?.applicationStatus}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Button
                                                variant="transparent"
                                                onClick={() =>
                                                    router.push(
                                                        `/work-provider/applicants/${applicant?.applicantId}`,
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

                    <EntityPagination
                        total={applicants.total}
                        createPageURL={(p: number) => setPage(p)}
                        perPage={10}
                    />
                </Paper>
            ) : (
                <NoData />
            )}
        </Stack>
    );
};

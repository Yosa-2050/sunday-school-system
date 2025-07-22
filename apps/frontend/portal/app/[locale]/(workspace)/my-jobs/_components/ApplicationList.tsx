import { EntityPagination } from '@/components/EntityPagination';
import { useRouter } from '@/i18n/routing';
import {
    Badge,
    Box,
    Button,
    Divider,
    Grid,
    Group,
    LoadingOverlay,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import {
    type Payload,
    useFetchAppliedJobs,
    useFetchRejectedJobs,
    useFetchShotlistedJobs,
} from 'app/_api/jobs/fetch-applied-jobs';
import { useState } from 'react';

interface JobApplication {
    id: string;
    status: string;
    createdAt: string;
    program: {
        id: string;
        title: string;
        organization: {
            name: string;
        };
        type: string;
        experianceLevel: string;
        workPlace: string | null;
        postedDate: string | null;
    };
}

function ApplicationsList({
    applications,
}: {
    applications: JobApplication[];
}) {
    const router = useRouter();

    const getStatusColor = (status: string) => {
        if (status === 'PENDING') {
            return 'yellow';
        }
        if (status === 'APPROVED') {
            return 'green';
        }
        if (status === 'SHORT_LISTED') {
            return 'primary';
        }
        return 'red';
    };

    if (applications.length === 0) {
        return (
            <Box className="flex flex-col items-center justify-center h-[400px]">
                <Text size="lg" c="dimmed" ta="center">
                    No applications found
                </Text>
                <Button
                    variant="light"
                    color="primary"
                    mt="md"
                    onClick={() => router.push('/jobs')}
                >
                    Browse Jobs
                </Button>
            </Box>
        );
    }

    return (
        <Stack gap="md">
            <Grid>
                {applications.map((application) => (
                    <Grid.Col
                        span={{ base: 12, md: 6, lg: 4 }}
                        key={application.id}
                    >
                        <Paper
                            withBorder
                            p="md"
                            radius="md"
                            className="hover:shadow-md transition-shadow"
                            h={'180px'}
                        >
                            <Group justify="space-between" align="flex-start">
                                <div className="flex-1">
                                    <Group justify="space-between" mb="xs">
                                        <Title order={4}>
                                            {application.program?.title}
                                        </Title>
                                        <Badge
                                            color={getStatusColor(
                                                application.status,
                                            )}
                                        >
                                            {application.status}
                                        </Badge>
                                    </Group>
                                    <Text size="sm" c="dimmed" mb="xs">
                                        {
                                            application.program?.organization
                                                ?.name
                                        }
                                    </Text>
                                    <Group gap="xs" mb="xs">
                                        {/* <Badge variant="light" color="blue">
                                            {application.program?.type}
                                        </Badge> */}
                                        <Badge variant="light" color="grape">
                                            {
                                                application.program
                                                    ?.experianceLevel
                                            }
                                        </Badge>
                                        <Badge variant="light" color="teal">
                                            {application.program?.workPlace ||
                                                'Remote'}
                                        </Badge>
                                    </Group>
                                    <Text size="sm" c="dimmed">
                                        Applied on:{' '}
                                        {application.createdAt
                                            ? new Date(
                                                  application.createdAt || '',
                                              ).toLocaleDateString()
                                            : 'N/A'}
                                    </Text>
                                </div>
                                <Button
                                    variant="light"
                                    color="primary"
                                    onClick={() =>
                                        router.push(
                                            `/jobs/${application.program?.id}`,
                                        )
                                    }
                                    size="xs"
                                >
                                    View Details
                                </Button>
                            </Group>
                        </Paper>
                    </Grid.Col>
                ))}
            </Grid>
        </Stack>
    );
}

export { ApplicationsList };

export const AppliedJobs = () => {
    const [payload, setPayload] = useState<Omit<Payload, 'status'>>({
        pagination: {
            status: 'All',
            search: '',
            page: 1,
            limit: 10,
        },
    });
    const [delayedSearch] = useDebouncedValue(payload.pagination.search, 300);
    const { data: appliedJobs, isFetching } = useFetchAppliedJobs({
        ...payload,
        pagination: {
            ...payload.pagination,
            search: delayedSearch,
        },
    });
    if (isFetching) {
        return (
            <LoadingOverlay
                visible={true}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
            />
        );
    }
    return (
        <Box>
            <TextInput
                placeholder="Search applications..."
                mb="md"
                onChange={(e) =>
                    setPayload((prev) => ({
                        ...prev,
                        pagination: {
                            ...prev.pagination,
                            search: e.target.value,
                            page: 1,
                        },
                    }))
                }
                value={payload.pagination.search}
                leftSection={<i className="ri-search-line" />}
                rightSection={
                    <Button
                        variant="light"
                        color="primary"
                        onClick={() =>
                            setPayload((prev) => ({
                                ...prev,
                                pagination: {
                                    ...prev.pagination,
                                    page: 1,
                                },
                            }))
                        }
                    >
                        Search
                    </Button>
                }
                radius="md"
                size="md"
                className="mb-4"
                rightSectionWidth={87}
            />
            <Divider mb="md" />
            <ApplicationsList applications={appliedJobs?.data ?? []} />
            <EntityPagination total={appliedJobs?.total || 0} perPage={10} />
        </Box>
    );
};

export const ShortlistedJobs = () => {
    const [payload, setPayload] = useState<Omit<Payload, 'status'>>({
        pagination: {
            status: 'All',
            search: '',
            page: 1,
            limit: 10,
        },
    });
    const [delayedSearch] = useDebouncedValue(payload.pagination.search, 300);
    const { data: shortlistedJobs, isFetching } = useFetchShotlistedJobs({
        ...payload,
        pagination: {
            ...payload.pagination,
            search: delayedSearch,
        },
    });
    if (isFetching) {
        return (
            <LoadingOverlay
                visible={true}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
            />
        );
    }
    return (
        <Box>
            <TextInput
                placeholder="Search shortlisted jobs..."
                mb="md"
                onChange={(e) =>
                    setPayload((prev) => ({
                        ...prev,
                        pagination: {
                            ...prev.pagination,
                            search: e.target.value,
                            page: 1,
                        },
                    }))
                }
                value={payload.pagination.search}
                leftSection={<i className="ri-search-line" />}
                rightSection={
                    <Button
                        variant="light"
                        color="primary"
                        onClick={() =>
                            setPayload((prev) => ({
                                ...prev,
                                pagination: {
                                    ...prev.pagination,
                                    page: 1,
                                },
                            }))
                        }
                    >
                        Search
                    </Button>
                }
                radius="md"
                size="md"
                className="mb-4"
                rightSectionWidth={87}
            />
            <Divider mb="md" />
            <ApplicationsList applications={shortlistedJobs?.data ?? []} />
            <EntityPagination
                total={shortlistedJobs?.total || 0}
                perPage={10}
            />
        </Box>
    );
};

export const RejectedJobs = () => {
    const [payload, setPayload] = useState<Omit<Payload, 'status'>>({
        pagination: {
            status: 'All',
            search: '',
            page: 1,
            limit: 10,
        },
    });
    const [delayedSearch] = useDebouncedValue(payload.pagination.search, 300);
    const { data: rejectedJobs, isFetching } = useFetchRejectedJobs({
        ...payload,
        pagination: {
            ...payload.pagination,
            search: delayedSearch,
        },
    });
    if (isFetching) {
        return (
            <LoadingOverlay
                visible={true}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
            />
        );
    }
    return (
        <Box>
            <TextInput
                placeholder="Search rejected jobs..."
                mb="md"
                onChange={(e) =>
                    setPayload((prev) => ({
                        ...prev,
                        pagination: {
                            ...prev.pagination,
                            search: e.target.value,
                            page: 1,
                        },
                    }))
                }
                value={payload.pagination.search}
                leftSection={<i className="ri-search-line" />}
                rightSection={
                    <Button
                        variant="light"
                        color="primary"
                        onClick={() =>
                            setPayload((prev) => ({
                                ...prev,
                                pagination: {
                                    ...prev.pagination,
                                    page: 1,
                                },
                            }))
                        }
                    >
                        Search
                    </Button>
                }
                radius="md"
                size="md"
                className="mb-4"
                rightSectionWidth={87}
            />
            <Divider mb="md" />
            <ApplicationsList applications={rejectedJobs?.data ?? []} />
            <EntityPagination total={rejectedJobs?.total || 0} perPage={10} />
        </Box>
    );
};

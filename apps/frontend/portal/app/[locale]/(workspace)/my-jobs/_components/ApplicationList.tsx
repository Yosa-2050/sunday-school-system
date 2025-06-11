import { useRouter } from '@/i18n/routing';
import {
    Badge,
    Box,
    Button,
    Grid,
    Group,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';

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
        if (status === 'SHORTLISTED') {
            return 'blue';
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

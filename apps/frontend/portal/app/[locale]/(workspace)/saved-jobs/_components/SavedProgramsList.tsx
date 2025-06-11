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
import { useRouter } from 'next-nprogress-bar';

function SavedJobsList({
    applications,
}: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    applications?: any[];
}) {
    const router = useRouter();
    if (applications?.length === 0) {
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
                {applications?.map((application) => {
                    return (
                        <Grid.Col
                            span={{ base: 12, md: 6, lg: 4 }}
                            key={application?.id}
                        >
                            <Paper
                                withBorder
                                p="md"
                                radius="md"
                                className="hover:shadow-md transition-shadow"
                                h={'180px'}
                            >
                                <Group
                                    justify="space-between"
                                    align="flex-start"
                                >
                                    <div className="flex-1">
                                        <Group justify="space-between" mb="xs">
                                            <Title order={4}>
                                                {application?.title}
                                            </Title>
                                        </Group>
                                        <Text size="sm" c="dimmed" mb="xs">
                                            {application?.organization?.name}
                                        </Text>
                                        <Group gap="xs" mb="xs">
                                            <Badge variant="light" color="blue">
                                                {application?.type}
                                            </Badge>
                                            <Badge
                                                variant="light"
                                                color="grape"
                                            >
                                                {application?.experianceLevel}
                                            </Badge>
                                            <Badge variant="light" color="teal">
                                                {application?.workPlace ||
                                                    'Remote'}
                                            </Badge>
                                        </Group>
                                        <Text size="sm" c="dimmed">
                                            Posted on:{' '}
                                            {application?.createdAt
                                                ? new Date(
                                                      application?.createdAt ||
                                                          '',
                                                  ).toLocaleDateString()
                                                : 'N/A'}
                                        </Text>
                                    </div>
                                    <Button
                                        variant="light"
                                        color="primary"
                                        onClick={() =>
                                            router.push(
                                                `/jobs/${application?.id}`,
                                            )
                                        }
                                        size="xs"
                                    >
                                        View Details
                                    </Button>
                                </Group>
                            </Paper>
                        </Grid.Col>
                    );
                })}
            </Grid>
        </Stack>
    );
}

export { SavedJobsList };

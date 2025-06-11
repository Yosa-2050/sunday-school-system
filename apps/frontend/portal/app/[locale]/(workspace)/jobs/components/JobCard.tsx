import { useRouter } from '@/i18n/routing';
import {
    ActionIcon, Badge,
    Box,
    Button,
    Card,
    Divider,
    Flex,
    Group,
    Stack,
    Text,
    TypographyStylesProvider
} from '@mantine/core';
import { IconClock, IconHeart, IconHeartFilled } from '@tabler/icons-react';
import type { ResponseItem } from 'app/_api/jobs/fetch-jobs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import parse from 'html-react-parser';

dayjs.extend(relativeTime);

interface JobCardProps {
    job: ResponseItem;
}

export function JobCard({ job }: JobCardProps) {
    const router = useRouter();

    return (
        <Card
            shadow="sm"
            radius="md"
            p={8}
            withBorder
            className="relative group"
        >
            <Stack p={8} gap="xs">
                <Group justify="space-between" align="flex-start">
                    <Group gap="sm">
                        {/* <Avatar size="md" radius="md" color="primary"></Avatar> */}
                        <Box>
                            <Text
                                size="sm"
                                fw={600}
                                className="cursor-pointer text-gray-900 hover:text-primary transition-colors line-clamp-2"
                                onClick={() => router.push(`/jobs/${job.id}`)}
                            >
                                {job.title}
                            </Text>
                        </Box>
                    </Group>

                    {job.applied ? (
                        <Badge size="xs" color="green">
                            Applied
                        </Badge>
                    ) : (
                        <ActionIcon variant="subtle" color="red" radius="xl">
                            {job.saved ? (
                                <IconHeartFilled size={18} />
                            ) : (
                                <IconHeart size={18} />
                            )}
                        </ActionIcon>
                    )}
                </Group>

                <Group gap="xs" mt="xs" wrap="wrap" align="center">
                    <Group gap="xs">
                        <Badge
                            color="primary"
                            variant="light"
                            radius="sm"
                            size="xs"
                        >
                            {job.experianceLevel}
                        </Badge>
                    </Group>
                    <Group gap={4}>
                        <IconClock size={14} className="text-primary" />
                        <Text size="xs" color="dimmed">
                            {dayjs(job.postedDate).fromNow()}
                        </Text>
                    </Group>
                </Group>

                <TypographyStylesProvider>
                    <Text
                        size="xs"
                        lineClamp={2}
                        color="gray.7"
                        className="mt-1"
                    >
                        {parse(job.description.replace(/<[^>]+>/g, ' '))}
                    </Text>
                </TypographyStylesProvider>

                <Divider my="xs" />

                <Flex justify="flex-end">
                    <Button
                        size="xs"
                        radius="sm"
                        variant="light"
                        // variant="gradient"
                        // gradient={{ from: 'primary', to: 'blue' }}
                        onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                        View Details
                    </Button>
                </Flex>
            </Stack>
        </Card>
    );
}

import { useRouter } from '@/i18n/routing';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Group,
    Text,
    TypographyStylesProvider,
} from '@mantine/core';
import {
    IconBriefcase,
    IconClock,
    IconCurrencyDollar,
    IconHeart,
    IconMapPin,
    IconStar,
} from '@tabler/icons-react';
import parse from 'html-react-parser';

interface JobCardProps {
    job: {
        id: string;
        title: string;
        organization?: {
            name: string;
        };
        createdAt: string;
        postedDate: string | null;
        type: string;
        salaryFrom: number;
        salaryTo: number;
        currency: string;
        experianceLevel: string;
        description: string;
        applied?: boolean;
        createdDate: string;
    };
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
const getElapsedTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
};

export function JobCard({ job }: JobCardProps) {
    const router = useRouter();

    return (
        <Card className="group" shadow="sm">
            {/* Featured badge */}
            {job.id === '1' && (
                <div className="absolute top-0 right-0">
                    <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center">
                        <IconStar size={14} className="mr-1" />
                        Featured
                    </div>
                </div>
            )}

            <div className="p-4 md:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center">
                            <Avatar
                                size="md"
                                visibleFrom="md"
                                color="primary"
                                radius="md"
                            >
                                {job.organization?.name.slice(0, 2)}
                            </Avatar>
                            <Avatar
                                size="sm"
                                hiddenFrom="md"
                                color="primary"
                                radius="md"
                            >
                                {job.organization?.name.slice(0, 2)}
                            </Avatar>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-start">
                            <div className="min-w-0">
                                <Text
                                    component="h3"
                                    size="sm"
                                    visibleFrom="md"
                                    className="text-gray-900 hover:text-primary transition-colors cursor-pointer line-clamp-2"
                                    onClick={() =>
                                        router.push(`/jobs/${job.id}`)
                                    }
                                >
                                    {job.title}
                                </Text>
                                <Text
                                    component="h3"
                                    size="xs"
                                    hiddenFrom="md"
                                    className="text-gray-900 hover:text-primary transition-colors cursor-pointer line-clamp-2"
                                    onClick={() =>
                                        router.push(`/jobs/${job.id}`)
                                    }
                                >
                                    {job.title}
                                </Text>
                                {job.applied ? (
                                    <Badge size="xs">Applied</Badge>
                                ) : (
                                    <Box hidden>
                                        <IconHeart
                                            size={20}
                                            className="text-gray-500 hover:text-primary transition-colors cursor-pointer"
                                        />
                                    </Box>
                                )}
                                <Text
                                    size="xs"
                                    fw={500}
                                    c="dimmed"
                                    className="mt-1 line-clamp-1"
                                >
                                    {job.organization?.name}
                                </Text>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                                <IconClock
                                    size={14}
                                    className="mr-1 text-primary"
                                />
                                <Text size="xs">
                                    {job?.postedDate
                                        ? getElapsedTime(job.postedDate)
                                        : getElapsedTime(job.createdDate)}
                                </Text>
                            </div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                            <div className="flex items-center text-xs text-gray-500">
                                <IconMapPin
                                    size={14}
                                    className="mr-1 text-primary"
                                />
                                <Text size="xs">Remote</Text>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                                <IconBriefcase
                                    size={14}
                                    className="mr-1 text-primary"
                                />
                                <Text size="xs">{job.type}</Text>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                                <IconCurrencyDollar
                                    size={14}
                                    className="mr-1 text-primary"
                                />
                                <Text size="xs">
                                    {(() => {
                                        if (job?.salaryFrom && job?.salaryTo) {
                                            return `${job.salaryFrom.toLocaleString()} - ${job.salaryTo.toLocaleString()} ${job.currency}`;
                                        }
                                        if (job?.salaryFrom) {
                                            return `${job.salaryFrom.toLocaleString()} ${job.currency}`;
                                        }
                                        return 'N/A';
                                    })()}
                                </Text>
                            </div>
                        </div>

                        <Group gap="xs" mt="sm">
                            <Badge
                                color="primary"
                                variant="light"
                                radius="sm"
                                size="xs"
                            >
                                {job.experianceLevel || 'Any Experience'}
                            </Badge>
                        </Group>

                        <Box mt="sm">
                            <TypographyStylesProvider>
                                <Text
                                    size="xs"
                                    lineClamp={2}
                                    className="text-gray-600"
                                >
                                    {parse(
                                        job.description.replace(
                                            /<[^>]+>/g,
                                            ' ',
                                        ),
                                    )}
                                </Text>
                            </TypographyStylesProvider>
                        </Box>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                                variant="gradient"
                                gradient={{ from: 'primary', to: 'blue' }}
                                radius="sm"
                                size="xs"
                                visibleFrom="md"
                                onClick={() => router.push(`/jobs/${job.id}`)}
                            >
                                View Details
                            </Button>
                            <Button
                                variant="gradient"
                                gradient={{ from: 'primary', to: 'blue' }}
                                radius="sm"
                                size="xs"
                                hiddenFrom="md"
                                fullWidth
                                onClick={() => router.push(`/jobs/${job.id}`)}
                            >
                                View Details
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

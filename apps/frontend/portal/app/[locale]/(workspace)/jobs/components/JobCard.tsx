import { useRouter } from '@/i18n/routing';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Group,
    Text,
    TypographyStylesProvider,
} from '@mantine/core';
import {
    IconBriefcase,
    IconClock,
    IconCurrencyDollar,
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
        type: string;
        salaryFrom: number;
        salaryTo: number;
        currency: string;
        experienceLevel: string;
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
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
            {/* Featured badge */}
            {job.id === '1' && (
                <div className="absolute top-0 right-0">
                    <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center">
                        <IconStar size={14} className="mr-1" />
                        Featured
                    </div>
                </div>
            )}

            <div className="p-6">
                <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                            <Avatar
                                size="md"
                                color="primary"
                                radius="md"
                                className="object-contain"
                            >
                                {job.organization?.name.slice(0, 2)}
                            </Avatar>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                            <div>
                                <Text
                                    component="h3"
                                    size="lg"
                                    fw={600}
                                    className="text-gray-900 hover:text-primary transition-colors cursor-pointer"
                                    onClick={() =>
                                        router.push(`/jobs/${job.id}`)
                                    }
                                >
                                    {job.title}
                                </Text>
                                {job.applied && <Badge>Applied</Badge>}
                                <Text
                                    size="sm"
                                    fw={500}
                                    c="dimmed"
                                    className="mt-1"
                                >
                                    {job.organization?.name}
                                </Text>
                            </div>
                            <div className="mt-2 md:mt-0 text-sm text-gray-500 flex items-center">
                                <IconClock
                                    size={16}
                                    className="mr-1 text-primary"
                                />
                                <Text size="sm">
                                    {getElapsedTime(job.createdDate)}
                                </Text>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-y-2">
                            <div className="flex items-center text-sm text-gray-500 mr-4">
                                <IconMapPin
                                    size={16}
                                    className="mr-1 text-primary"
                                />
                                <Text size="sm">Remote</Text>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mr-4">
                                <IconBriefcase
                                    size={16}
                                    className="mr-1 text-primary"
                                />
                                <Text size="sm">{job.type}</Text>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <IconCurrencyDollar
                                    size={16}
                                    className="mr-1 text-primary"
                                />
                                <Text size="sm">
                                    {job.salaryFrom.toLocaleString()} -{' '}
                                    {job.salaryTo.toLocaleString()}{' '}
                                    {job.currency}
                                </Text>
                            </div>
                        </div>

                        <Group gap="xs" mt="md">
                            <Badge color="primary" variant="light" radius="sm">
                                {job.experienceLevel || 'Any Experience'}
                            </Badge>
                        </Group>

                        <Box mt="md">
                            <TypographyStylesProvider>
                                <Text
                                    size="sm"
                                    lineClamp={2}
                                    className="text-gray-600"
                                >
                                    {parse(job.description)}
                                </Text>
                            </TypographyStylesProvider>
                        </Box>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Button
                                variant="gradient"
                                gradient={{
                                    from: 'primary',
                                    to: 'blue',
                                }}
                                radius="md"
                                onClick={() => router.push(`/jobs/${job.id}`)}
                            >
                                View Details
                            </Button>
                            {/* <Button variant="outline" color="primary" radius="md">
                Apply Now
              </Button> */}
                            {/* <Button
                variant="outline"
                color="gray"
                radius="md"
                leftSection={<IconBookmark size={16} />}
                className="ml-auto"
              >
                Save
              </Button> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom border with gradient */}
            {/* <div className="h-1 w-full bg-gradient-to-r from-primary to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" /> */}
        </div>
    );
}

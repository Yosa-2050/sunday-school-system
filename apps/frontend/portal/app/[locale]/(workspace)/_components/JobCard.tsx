import { useJobs } from '@/hooks/jobs.hook';
import {
    Badge,
    Button,
    Card,
    Divider,
    Flex,
    Group,
    Text,
    Title,
    TypographyStylesProvider,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconBookmark, IconBriefcase } from '@tabler/icons-react';
import type { Response } from 'app/_api/jobs/fetch-jobs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next-nprogress-bar';

dayjs.extend(relativeTime);

type JobCardProps = {
    job: Response['data'][number];
    refetch: () => void;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export const JobCard = ({ job, refetch }: JobCardProps) => {
    const router = useRouter();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { likeMutation, unlikeMutation } = useJobs({
        isJob: job?.programType === 'Job',
    });

    const handleLikeUnlike = async (saved: boolean, programId: string) => {
        if (saved) {
            await unlikeMutation.mutate(programId);
        } else {
            await likeMutation.mutate(programId);
        }
    };

    return (
        <Card
            key={job.id}
            withBorder
            radius="md"
            shadow="sm"
            padding={isMobile ? 'sm' : 'lg'}
            className="hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            style={{
                maxHeight: isMobile ? 'none' : '300px',
            }}
        >
            <Flex
                direction={isMobile ? 'column' : 'row'}
                justify="space-between"
                align={isMobile ? 'flex-start' : 'center'}
                gap={isMobile ? 'sm' : 'md'}
            >
                {/* Job title & like/save */}
                <Flex
                    direction="column"
                    className="flex-1"
                    style={{ minWidth: 0 }} // prevent flex overflow
                >
                    <Title
                        order={isMobile ? 5 : 4}
                        className="font-semibold line-clamp-1 cursor-pointer transition-colors"
                        onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                        {job.title}
                    </Title>

                    <Group mt={isMobile ? 'xs' : 0} gap="xs" wrap="wrap">
                        <Badge
                            color="green"
                            variant="light"
                            leftSection={<IconBriefcase size={14} />}
                        >
                            {job.programType}
                        </Badge>
                        <Badge
                            color="green"
                            variant="light"
                            leftSection={<IconBriefcase size={14} />}
                        >
                            {job.experianceLevel}
                        </Badge>
                    </Group>
                </Flex>

                {/* Save/Applied button */}
                <div>
                    {job.applied ? (
                        <Badge>Applied</Badge>
                    ) : (
                        <Button
                            variant="subtle"
                            size="xs"
                            onClick={async () => {
                                await handleLikeUnlike(job.saved, job.id);
                            }}
                            className="flex items-center font-semibold justify-end cursor-pointer w-fit gap-1.5"
                            color={job.saved ? 'green' : 'gray'}
                            loading={
                                likeMutation.isPending ||
                                unlikeMutation.isPending
                            }
                            disabled={
                                likeMutation.isPending ||
                                unlikeMutation.isPending
                            }
                        >
                            <IconBookmark size={14} stroke={2} />
                            <Text>{job.saved ? 'Saved' : 'Save'}</Text>
                        </Button>
                    )}
                </div>
            </Flex>

            {/* Description */}
            <TypographyStylesProvider mt="sm">
                <div
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                    dangerouslySetInnerHTML={{
                        __html: job.description.replace(/<[^>]+>/g, ' '),
                    }}
                    className="text-sm text-gray-600"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: isMobile ? 3 : 2, // show more lines on mobile
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.5em',
                    }}
                />
            </TypographyStylesProvider>

            <Divider my="sm" />

            {/* Footer */}
            <Flex
                direction={isMobile ? 'column' : 'row'}
                justify={job.postedDate ? 'space-between' : 'flex-end'}
                align={isMobile ? 'stretch' : 'center'}
                gap={isMobile ? 'xs' : 0}
            >
                {job.postedDate && (
                    <Text size="xs" c="dimmed">
                        {dayjs(job.postedDate).fromNow()}
                    </Text>
                )}
                <Button
                    variant="filled"
                    fullWidth={isMobile}
                    onClick={() => router.push(`/jobs/${job.id}`)}
                    className="transition-colors"
                >
                    Detail
                </Button>
            </Flex>
        </Card>
    );
};

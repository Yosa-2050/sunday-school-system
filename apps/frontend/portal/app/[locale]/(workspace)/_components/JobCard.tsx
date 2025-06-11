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
import type { UseMutationResult } from '@tanstack/react-query';
import type { Response } from 'app/_api/jobs/fetch-jobs';
import { useRouter } from 'next-nprogress-bar';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type JobCardProps = {
    job: Response['data'][number];
    likeMutation: UseMutationResult<
        {
            success: boolean;
            message: string;
        },
        Error,
        string,
        unknown
    >;
    unlikeMutation: UseMutationResult<
        {
            success: boolean;
            message: string;
        },
        Error,
        string,
        unknown
    >;
};

export const JobCard = ({
    job,
    likeMutation,
    unlikeMutation,
}: JobCardProps) => {
    const router = useRouter();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const handleLikeUnlike = (saved: boolean, programId: string) => {
        if (saved) {
            unlikeMutation.mutate(programId);
        } else {
            likeMutation.mutate(programId);
        }
    };

    return (
        <Card
            key={job.id}
            withBorder
            radius="md"
            shadow="sm"
            padding={isMobile ? 'sm' : 'lg'}
            className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 max-h-[300px] overflow-hidden"
        >
            <Group justify="space-between" align="flex-start">
                <Group gap="sm" className="w-full">
                    <Flex align={'center'} justify={'space-between'} w={'100%'}>
                        <div className="flex items-center flex-1">
                            {/* <Avatar
                                size={isMobile ? 'sm' : 'lg'}
                                color="blue"
                                radius="xl"
                            > */}
                            {/* {job.organization?.name.slice(0, 2)} */}
                            {/* </Avatar> */}
                            <Title
                                order={isMobile ? 5 : 4}
                                className="font-semibold line-clamp-1 cursor-pointer transition-colors"
                                onClick={() => router.push(`/jobs/${job.id}`)}
                            >
                                {job.title}
                            </Title>
                        </div>
                        {job.applied ? (
                            <Badge>Applied</Badge>
                        ) : (
                            <Button
                                variant="subtle"
                                size="xs"
                                onClick={() =>
                                    handleLikeUnlike(job.saved, job.id)
                                }
                                className="flex items-center font-semibold justify-end cursor-pointer w-fit gap-1.5"
                                color={job.saved ? 'green' : 'gray'}
                            >
                                <IconBookmark size={14} stroke={2} />
                                <Text>{job.saved ? 'Saved' : 'Save'}</Text>
                            </Button>
                        )}
                    </Flex>
                    <Text size="sm" c="dimmed" className="line-clamp-1">
                        {/* {job.organization?.name} */}
                    </Text>
                </Group>
            </Group>

            <Group mt="sm" gap="xs">
                <Badge
                    color="green"
                    variant="light"
                    leftSection={<IconBriefcase size={14} />}
                >
                    {job.experianceLevel}
                </Badge>
            </Group>

            <TypographyStylesProvider mt="md">
                <div
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                    dangerouslySetInnerHTML={{
                        __html: job.description.replace(/<[^>]+>/g, ' '),
                    }}
                    className="text-sm text-gray-600"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxHeight: '3em',
                        lineHeight: '1.5em',
                    }}
                />
            </TypographyStylesProvider>

            <Divider my="sm" />

            <Flex
                justify={job.postedDate ? 'space-between' : 'flex-end'}
                align="center"
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

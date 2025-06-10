import { LoadingOverlay, Card, Group, Flex, Avatar, Title, Badge, TypographyStylesProvider, Divider, Button, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { entityParamSchema, PER_PAGE } from "@shega/shared";
import { IconBriefcase } from "@tabler/icons-react";
import { useRouter } from "next-nprogress-bar";
import { useQueryState, parseAsJson } from "nuqs";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useJobs } from "@/hooks/jobs.hook";

dayjs.extend(relativeTime);

interface JobFilters {
    location: string;
    jobType: string;
    salaryRange: string;
    experienceLevel: string;
    keyword: string;
}

// Components
export function JobList({ filters }: { filters: JobFilters }) {
    const router = useRouter();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [entityParams, setEntityParams] = useQueryState(
        'job-seeker-jbs',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: PER_PAGE,
            //   f: [{ f: "applied", v: "false", o: "eq" }],
        }),
    );

    const {data, isLoading, error, likeMutation,unlikeMutation} = useJobs(entityParams)

    const handleLikeUnlike = (saved: boolean, programId: string) => {
        if (saved) {
            unlikeMutation.mutate(programId);
        } else {
            likeMutation.mutate(programId);
        }
    };

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }
    if (error) {
        return <Text color="red">Error loading jobs</Text>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation> */}
            {data?.data.slice(0, 4).map((job) => (
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
                            <Flex
                                align={'center'}
                                justify={'space-between'}
                                w={'100%'}
                            >
                                <div className="flex items-center flex-1">
                                    <Avatar
                                        size={isMobile ? 'sm' : 'lg'}
                                        color="blue"
                                        radius="xl"
                                    >
                                        {/* {job.organization?.name.slice(0, 2)} */}
                                    </Avatar>
                                    <Title
                                        order={isMobile ? 5 : 4}
                                        className="font-semibold line-clamp-1 cursor-pointer transition-colors"
                                        onClick={() =>
                                            router.push(`/jobs/${job.id}`)
                                        }
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
                                            handleLikeUnlike(
                                                job.saved,
                                                job.programId,
                                            )
                                        }
                                        className="flex items-center justify-end cursor-pointer w-fit"
                                        color={job.saved ? 'green' : 'gray'}
                                    >
                                       {job.saved ? 'Saved' : 'Save'}
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
                                __html: job.description.replace(
                                    /<[^>]+>/g,
                                    ' ',
                                ),
                            }}
                            className="text-sm text-gray-600"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxHeight: '3em', // Fallback for line clamp
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
                            onClick={() => router.push(`/jobs/${job.programId}`)}
                            className="transition-colors"
                        >
                            Detail
                        </Button>
                    </Flex>
                </Card>
            ))}

            <div className="col-span-full flex justify-center mt-4">
                <Button
                    variant="light"
                    onClick={() => router.push('/jobs')}
                    className="transition-colors"
                >
                    View More Jobs
                </Button>
            </div>
        </div>
    );
}

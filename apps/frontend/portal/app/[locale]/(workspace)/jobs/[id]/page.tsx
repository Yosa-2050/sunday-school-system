'use client';

import { Footer } from '@/components/Footer';
import { useJobs } from '@/hooks/jobs.hook';
import {
    Badge,
    Button,
    Card,
    Container,
    Flex,
    Group,
    LoadingOverlay,
    Modal,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBookmark } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchJobsById } from 'app/_api/jobs/fetch-job-id';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { JobContent } from './_components/JobContent';
import { JobDetailSideBar } from './_components/JobSidebar';

export default function JobDetailsPage() {
    const params = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('overview');
    const [applicationProgress, setApplicationProgress] = useState(60);

    const [opened, { close }] = useDisclosure(false);
    const [cvUrl, setCvUrl] = useState<string | null>(null);

    const {
        data: job,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['job', params.id],
        queryFn: () => {
            if (!params.id) {
                throw new Error('Job ID is required');
            }
            return fetchJobsById(params.id);
        },
        enabled: !!params.id,
    });

    const { likeMutation, unlikeMutation } = useJobs({
        isJob: job?.type === 'Job',
    });

    const handleLikeUnlike = async (saved: boolean, programId: string) => {
        if (saved) {
            await unlikeMutation.mutateAsync(programId);
            await refetch();
        } else {
            await likeMutation.mutate(programId);
            await refetch();
        }
    };

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (error || !job) {
        return (
            <Container size="xl" py="xl">
                <Text c="red">Error loading job details</Text>
            </Container>
        );
    }

    return (
        <>
            <Container size="xl" py="xl">
                {/* Application Status Bar */}
                <Flex direction={{ base: 'column', md: 'row' }} gap="md">
                    <Stack className="flex-1">
                        <Card className="w-full">
                            <Group justify={'space-between'}>
                                <Stack gap="xs">
                                    <Title order={5}>Application Status</Title>
                                    <Group>
                                        {job?.applied ? (
                                            <Badge size="xs">Applied</Badge>
                                        ) : (
                                            <></>
                                        )}
                                        <Text size="xs" c="dimmed">
                                            Last saved 2 hours ago
                                        </Text>
                                    </Group>
                                </Stack>

                                <Flex direction={'column'}>
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
                                        <Text>
                                            {job.saved ? 'Saved' : 'Save'}
                                        </Text>
                                    </Button>
                                </Flex>
                            </Group>
                        </Card>

                        <JobContent
                            activeTab={activeTab}
                            job={job}
                            setActiveTab={setActiveTab}
                            setApplicationProgress={setApplicationProgress}
                            setCvUrl={setCvUrl}
                        />
                    </Stack>

                    <JobDetailSideBar
                        organizationName={job?.organization?.name ?? ''}
                        setActiveTab={setActiveTab}
                        job={job}
                    />
                </Flex>
            </Container>

            <Footer />

            <Modal
                opened={opened}
                onClose={close}
                title="View Resume"
                size="xl"
                centered
            >
                {cvUrl && (
                    <iframe
                        src={cvUrl}
                        style={{
                            width: '100%',
                            height: '80vh',
                            border: 'none',
                        }}
                        title="Resume Preview"
                    />
                )}
            </Modal>
        </>
    );
}

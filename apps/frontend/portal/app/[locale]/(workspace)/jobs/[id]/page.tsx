'use client';

import { Footer } from '@/components/Footer';
import { useJobs } from '@/hooks/jobs.hook';
import { useRouter } from '@/i18n/routing';
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
import { logger } from '@shega/shared';
import { IconBookmark } from '@tabler/icons-react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { fetchJobsById } from 'app/_api/jobs/fetch-job-id';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { JobContent } from './_components/JobContent';
import { JobDetailSideBar } from './_components/JobSidebar';

const queryClient = new QueryClient();

export default function JobDetailsPage() {
    const params = useParams<{ id: string }>();

    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [applicationProgress, setApplicationProgress] = useState(60);

    const [opened, { open, close }] = useDisclosure(false);
    const [cvUrl, setCvUrl] = useState<string | null>(null);

    const {
        data: job,
        isLoading,
        error,
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

    const { likeMutation, unlikeMutation } = useJobs();

    const handleLikeUnlike = async (saved: boolean, programId: string) => {
        if (saved) {
            await unlikeMutation.mutateAsync(programId);
            queryClient.invalidateQueries({ queryKey: ['job', params.id] });
        } else {
            await likeMutation.mutate(programId);
            queryClient.invalidateQueries({ queryKey: ['job', params.id] });
        }
    };

    if (isLoading) {
        return <LoadingOverlay visible={true} h="100vh" />;
    }

    if (error || !job) {
        return (
            <Container size="xl" py="xl">
                <Text color="red">Error loading job details</Text>
            </Container>
        );
    }

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: job.title,
                    text: `Check out this job opportunity: ${job.title} at ${job.organization?.name}`,
                    url: window.location.href,
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                // Could copy to clipboard or show a modal with share options
                logger.info('Web Share API not supported in this browser');
            }
        } catch (err) {
            logger.error('Error sharing:', err);
        }
    };

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

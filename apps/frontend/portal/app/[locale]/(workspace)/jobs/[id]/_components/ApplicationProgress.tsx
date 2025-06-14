import { useCanApply } from '@/hooks/can-apply.hook';
import {
    Badge,
    Button,
    Card,
    Flex,
    Group,
    LoadingOverlay,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { logger } from '@shega/shared';
import { IconCheck, IconShare } from '@tabler/icons-react';
import type { Job } from 'app/_api/jobs/fetch-job-id';

type ApplicationProgressProps = {
    setActiveTab: (value: string) => void;
    job: Job;
};

const CanApply = {
    cv: 'CV',
    coverLetter: 'Cover Letter',
    profilePic: 'Profile Picture',
    profile: 'Profile Information',
    education: 'Education',
    experiance: 'Experience',
} as const;

export const ApplicationProgress = ({
    setActiveTab,
    job,
}: ApplicationProgressProps) => {
    const { canApply, isLoading } = useCanApply();
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: job.title,
                    text: `Check out this job opportunity: ${job.title} at ${job.organization?.name}`,
                    url: window.location.href,
                });
            } else {
                logger.info('Web Share API not supported in this browser');
            }
        } catch (err) {
            logger.error('Error sharing:', err);
        }
    };
    if (isLoading) {
        return <LoadingOverlay visible={true} h={'100%'} />;
    }
    return (
        <Card>
            <Stack gap="sm">
                <Title order={4}>Application Progress</Title>
                <Stack gap="xs">
                    {Object.entries(canApply ?? {}).map(([key, value]) => {
                        if (CanApply?.[key as keyof typeof CanApply]) {
                            return (
                                <Group justify={'space-between'} key={key}>
                                    <Flex gap="xs" align="center">
                                        <Text size="xs">
                                            {CanApply?.[
                                                key as keyof typeof CanApply
                                            ] ?? ''}
                                        </Text>
                                        {(key === 'profile' ||
                                            key === 'cv' ||
                                            key === 'coverLetter') && (
                                            <Text c="red">*</Text>
                                        )}
                                    </Flex>
                                    {value ? (
                                        <Badge
                                            color="green"
                                            variant="light"
                                            size="xs"
                                            leftSection={
                                                <IconCheck size={12} />
                                            }
                                        >
                                            Complete
                                        </Badge>
                                    ) : (
                                        <Badge
                                            color="orange"
                                            variant="light"
                                            size="xs"
                                        >
                                            Pending
                                        </Badge>
                                    )}
                                </Group>
                            );
                        }
                    })}
                </Stack>
                <Button
                    variant="outline"
                    fullWidth
                    size="xs"
                    onClick={handleShare}
                >
                    <IconShare size={16} stroke={1.5} />
                    Share
                </Button>
            </Stack>
        </Card>
    );
};

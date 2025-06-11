import { useCanApply } from '@/hooks/can-apply.hook';
import {
    ActionIcon,
    Badge,
    Blockquote,
    Button,
    Flex,
    Group,
    Paper,
    Radio,
    Select,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Textarea,
    Title,
    Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { logger } from '@shega/shared';
import { useAuth } from '@shega/ui';
import { IconCheck, IconFileText, IconHelp } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { applyJobs } from 'app/_api/jobs/apply-job';
import type { Job } from 'app/_api/jobs/fetch-job-id';
import {
    useDownloadProfilePicture,
    useJobSeekerDetails,
} from 'app/_api/profile/queries';
import { useRouter } from 'next-nprogress-bar';

type JobApplicationPanelProps = {
    job: Job;
    setCvUrl: (value: string) => void;
    setApplicationProgress: (value: number) => void;
};

const experience = [
    {
        value: '0-1 year',
        label: '0-1 year',
    },
    {
        value: '1-3 years',
        label: '1-3 years',
    },
    {
        value: '3-5 years',
        label: '3-5 years',
    },
    {
        value: '5-7 years',
        label: '5-7 years',
    },
    {
        value: '7+ years',
        label: '7+ years',
    },
];

const availability = [
    {
        value: 'immediately',
        label: 'Immediately',
    },
    {
        value: '1 week',
        label: '1 week',
    },
    {
        value: '2 weeks',
        label: '2 weeks',
    },
    {
        value: '1 month',
        label: '1 month',
    },
    {
        value: '2+ months',
        label: '2+ months',
    },
];

export const JobApplicationPanel = ({
    job,
    setCvUrl,
    setApplicationProgress,
}: JobApplicationPanelProps) => {
    const { user } = useAuth();
    const router = useRouter();
    const { canApply, isLoading } = useCanApply();
    const { data: jobSeekerData } = useJobSeekerDetails();

    const { data: cv } = useDownloadProfilePicture(jobSeekerData?.cv ?? '');

    const applyMutation = useMutation({
        mutationFn: () => {
            if (!job?.programId) {
                throw new Error('Missing program ID');
            }
            return applyJobs(job.programId);
        },
        onSuccess: () => {
            // Update application status and progress
            setApplicationProgress(100);
            // Show success notification
            notifications.show({
                title: 'Application Submitted',
                message: 'Your application has been successfully submitted.',
                color: 'green',
            });
            // Redirect to applications page or show success state
            router.push('/jobs');
        },
        onError: (error) => {
            // Show error notification
            notifications.show({
                title: 'Application Failed',
                message:
                    'There was an error submitting your application. Please try again.',
                color: 'red',
            });
            logger.error('Application error:', error);
        },
    });

    const handleSubmitApplication = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/auth/login');
            return;
        }
        applyMutation.mutate();
    };

    const handleViewResume = (file: Blob) => {
        const url = URL.createObjectURL(file);
        setCvUrl(url);
        open();
    };
    return (
        <form onSubmit={handleSubmitApplication} className="w-full">
            <Stack gap="xl">
                {/* Personal Information */}
                <Stack gap="sm">
                    <Group justify={'space-between'}>
                        <Title visibleFrom="md" order={4} hiddenFrom="md">
                            Personal Information
                        </Title>
                        <Badge
                            color="green"
                            variant="light"
                            size="xs"
                            leftSection={<IconCheck size={12} />}
                        >
                            Auto-filled
                        </Badge>
                    </Group>

                    <SimpleGrid cols={{ base: 1, md: 2 }}>
                        <TextInput
                            label="Full Name"
                            name="fullName"
                            size="xs"
                            defaultValue={`${user?.firstName} ${user?.lastName}`}
                            readOnly
                        />
                        <TextInput
                            label="Email"
                            name="email"
                            type="email"
                            size="xs"
                            defaultValue={user?.user?.email}
                            readOnly
                        />
                    </SimpleGrid>
                </Stack>

                {/* Experience */}
                <Stack gap="sm">
                    <Title visibleFrom="md" order={4} hiddenFrom="md">
                        Experience & Preferences
                    </Title>

                    <SimpleGrid cols={{ base: 1, md: 2 }}>
                        <Select
                            label="Years of Experience"
                            size="xs"
                            data={experience}
                            defaultValue="3-5 years"
                        />
                        <Select
                            label="Availability to Start"
                            size="xs"
                            data={availability}
                            defaultValue="2 weeks"
                        />
                    </SimpleGrid>

                    <SimpleGrid cols={{ base: 1, md: 2 }}>
                        <Stack gap="sm">
                            <Text size="xs">Willing to Relocate?</Text>
                            <Radio.Group defaultValue="no" size="xs">
                                <Stack gap="xs">
                                    <Radio value="yes" label="Yes" />
                                    <Radio value="no" label="No" />
                                    <Radio
                                        value="maybe"
                                        label="Maybe, depending on location"
                                    />
                                </Stack>
                            </Radio.Group>
                        </Stack>
                        <TextInput
                            label="Salary Expectation"
                            name="salaryExpectation"
                            size="xs"
                            defaultValue="$90,000 - $120,000"
                        />
                    </SimpleGrid>
                    <Text size="xs" color="dimmed">
                        Salary range for this position: $120,000 - $150,000
                    </Text>
                </Stack>

                {/* Documents */}
                <Stack gap="sm">
                    <Group justify={'space-between'}>
                        <Title order={4}>Documents</Title>
                        <Tooltip label="Upload your resume and any other relevant documents. Accepted formats: PDF, DOC, DOCX. Maximum 5MB per file.">
                            <ActionIcon size="xs">
                                <IconHelp size={14} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>

                    <Stack gap="sm">
                        {[
                            {
                                id: 1,
                                name: 'CV',
                                size: '1.2 MB',
                                type: 'resume',
                                uploaded: true,
                                file: cv,
                            },
                        ].map((file) => (
                            <Paper key={file.id} p="sm" withBorder>
                                <Group justify={'space-between'}>
                                    <Group
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            if (cv) {
                                                handleViewResume(cv);
                                            }
                                        }}
                                    >
                                        <IconFileText size={16} color="gray" />
                                        <Stack gap={0}>
                                            <Text size="xs">{file.name}</Text>
                                            <Text size="xs" color="dimmed">
                                                {file.size}
                                            </Text>
                                        </Stack>
                                        {file.type === 'resume' && (
                                            <Badge
                                                color="green"
                                                variant="light"
                                                size="xs"
                                            >
                                                Primary Resume
                                            </Badge>
                                        )}
                                    </Group>
                                </Group>
                            </Paper>
                        ))}

                        {/* <FileInput
                            placeholder="Drop files here or click to upload"
                            leftSection={<IconUpload size={14} />}
                            accept=".pdf,.doc,.docx"
                            description="Attach additional documents (optional)"
                            size="xs"
                            hidden
                          /> */}
                    </Stack>
                </Stack>

                {/* Cover Letter */}
                <Stack gap="sm" hidden>
                    <Group justify={'space-between'}>
                        <Title visibleFrom="md" order={4} hiddenFrom="md">
                            Cover Letter
                        </Title>
                        <Text span color="dimmed" size="xs">
                            (Optional)
                        </Text>
                    </Group>
                    <Textarea
                        placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                        minRows={6}
                        name="coverLetter"
                        size="xs"
                    />
                    <Text size="xs" color="dimmed">
                        Adding a personalized cover letter increases your chance
                        of getting an interview by 40%.
                    </Text>
                </Stack>

                {/* Legal */}
                {/* {!job?.applied && (
                        <Checkbox
                          label={
                            <>
                              I agree to the terms and conditions. By applying,
                              you agree to our{" "}
                              <Anchor href="/legal/privacy" size="xs">
                                Privacy Policy
                              </Anchor>{" "}
                              and{" "}
                              <Anchor href="/legal/terms" size="xs">
                                Terms of Service
                              </Anchor>
                            </>
                          }
                          defaultChecked
                          required
                          size="xs"
                          hidden
                        />
                      )} */}
                {!canApply?.canApply && (
                    <Blockquote color="red">
                        <Text size="xs" color="dimmed">
                            You haven&#39;t completed your profile, so you
                            won&#39;t be able to apply for this job.
                        </Text>
                    </Blockquote>
                )}

                <Group grow>
                    {!job?.applied && canApply?.canApply && (
                        <Flex justify={'end'}>
                            <Button
                                w={'50%'}
                                type="submit"
                                size="xs"
                                loading={applyMutation.isPending || isLoading}
                                disabled={applyMutation.isPending}
                            >
                                Apply Now
                            </Button>
                        </Flex>
                    )}
                </Group>
            </Stack>
        </form>
    );
};

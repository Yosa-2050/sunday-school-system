'use client';

import { Footer } from '@/components/Footer';
import { useRouter } from '@/i18n/routing';
import {
    ActionIcon,
    Anchor,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Container,
    Divider,
    Flex,
    Group,
    List,
    LoadingOverlay,
    Modal,
    Paper,
    Progress,
    Radio,
    Rating,
    Select,
    SimpleGrid,
    Stack,
    Tabs,
    Text,
    TextInput,
    Textarea,
    Title,
    Tooltip,
    TypographyStylesProvider,
    useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { logger } from '@shega/shared';
import { useAuth } from '@shega/ui';
import {
    IconBuilding,
    IconCalendar,
    IconCheck,
    IconClock,
    IconCurrencyDollar,
    IconFileText,
    IconHelp,
    IconMapPin,
} from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { applyJobs } from 'app/_api/jobs/apply-job';
import { fetchJobsById } from 'app/_api/jobs/fetch-job-id';
import {
    useDownloadProfilePicture,
    useJobSeekerDetails,
} from 'app/_api/profile/queries';
import parse from 'html-react-parser';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function JobDetailsPage() {
    const params = useParams<{ id: string }>();
    const t = useTranslations('jobListing');
    const isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [applicationProgress, setApplicationProgress] = useState(60);
    const { user } = useAuth();
    const theme = useMantineTheme();
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
    const {
        data: jobSeekerData,
        isLoading: isJobSeekerDetailLoading,
        error: jobSeekerError,
    } = useJobSeekerDetails();
    const { data: cv } = useDownloadProfilePicture(jobSeekerData?.cv ?? '');

    const applyMutation = useMutation({
        mutationFn: () => applyJobs(params.id),
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

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
        }
    }, [user, router]);

    const handleViewResume = (file: Blob) => {
        const url = URL.createObjectURL(file);
        setCvUrl(url);
        open();
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

                                <Stack gap="xs" w={{ base: '100%', md: 200 }}>
                                    <Group justify={'space-between'}>
                                        <Text size="xs">Progress</Text>
                                        <Text size="xs">
                                            {applicationProgress}%
                                        </Text>
                                    </Group>
                                    <Progress
                                        value={applicationProgress}
                                        size="xs"
                                    />
                                </Stack>
                            </Group>
                        </Card>

                        {/* Main Content */}
                        <Card className="!w-full">
                            <Tabs
                                value={activeTab}
                                onChange={(value) =>
                                    setActiveTab(value || 'overview')
                                }
                            >
                                <Tabs.List>
                                    <Tabs.Tab value="overview" size="xs">
                                        Overview
                                    </Tabs.Tab>
                                    <Tabs.Tab value="application" size="xs">
                                        Application
                                    </Tabs.Tab>
                                </Tabs.List>

                                <Tabs.Panel value="overview" pt="md">
                                    <Stack gap="md">
                                        <Group wrap="nowrap">
                                            <Avatar
                                                size={isMobile ? 'sm' : 'lg'}
                                                radius="md"
                                                src="/placeholder.svg"
                                                alt="TechCorp Logo"
                                            />
                                            <Stack gap={0}>
                                                <Title
                                                    visibleFrom="md"
                                                    order={1}
                                                    hiddenFrom="md"
                                                >
                                                    {job.title}
                                                </Title>
                                                <Group gap="xs" wrap="wrap">
                                                    <Group gap={4}>
                                                        <IconBuilding
                                                            size={14}
                                                            color="gray"
                                                        />
                                                        <Text
                                                            size="xs"
                                                            color="dimmed"
                                                        >
                                                            {
                                                                job.organization
                                                                    ?.name
                                                            }
                                                        </Text>
                                                    </Group>
                                                    <Divider orientation="vertical" />
                                                    <Rating
                                                        value={4.5}
                                                        fractions={2}
                                                        readOnly
                                                        size="xs"
                                                    />
                                                    <Text
                                                        size="xs"
                                                        color="dimmed"
                                                    >
                                                        4.5 (126 reviews)
                                                    </Text>
                                                </Group>
                                                <Group
                                                    gap="md"
                                                    mt={4}
                                                    wrap="wrap"
                                                >
                                                    <Group gap={4}>
                                                        <IconMapPin
                                                            size={14}
                                                            color="gray"
                                                        />
                                                        <Text
                                                            size="xs"
                                                            color="dimmed"
                                                        >
                                                            {job.workPlace ||
                                                                'Remote'}
                                                        </Text>
                                                    </Group>
                                                    <Group gap={4}>
                                                        <IconCurrencyDollar
                                                            size={14}
                                                            color="gray"
                                                        />
                                                        <Text
                                                            size="xs"
                                                            color="dimmed"
                                                        >
                                                            {(() => {
                                                                if (
                                                                    job?.salaryFrom &&
                                                                    job?.salaryTo
                                                                ) {
                                                                    return `${job.salaryFrom.toLocaleString()} - ${job.salaryTo.toLocaleString()} ${job.currency}`;
                                                                }
                                                                if (
                                                                    job?.salaryFrom
                                                                ) {
                                                                    return `${job.salaryFrom.toLocaleString()} ${job.currency}`;
                                                                }
                                                                return 'N/A';
                                                            })()}
                                                        </Text>
                                                    </Group>
                                                    <Group gap={4}>
                                                        <IconClock
                                                            size={14}
                                                            color="gray"
                                                        />
                                                        <Text
                                                            size="xs"
                                                            color="dimmed"
                                                        >
                                                            {job.type}
                                                        </Text>
                                                    </Group>
                                                    <Group gap={4}>
                                                        <IconCalendar
                                                            size={14}
                                                            color="gray"
                                                        />
                                                        <Text
                                                            size="xs"
                                                            color="dimmed"
                                                        >
                                                            Posted 3 days ago
                                                        </Text>
                                                    </Group>
                                                </Group>
                                            </Stack>
                                        </Group>

                                        <Stack gap="md">
                                            <Stack gap="xs">
                                                <Group>
                                                    <Title
                                                        visibleFrom="md"
                                                        order={4}
                                                        hiddenFrom="md"
                                                    >
                                                        Job Description
                                                    </Title>
                                                    <Badge size="xs">New</Badge>
                                                </Group>
                                                <TypographyStylesProvider>
                                                    <Box className="prose prose-stone max-w-none">
                                                        {parse(job.description)}
                                                    </Box>
                                                </TypographyStylesProvider>
                                            </Stack>

                                            <Stack gap="xs">
                                                <Title order={4}>
                                                    Requirements
                                                </Title>
                                                <List size="xs" color="dimmed">
                                                    {job.jobDescriptions?.filter(
                                                        (desc) =>
                                                            desc.type ===
                                                                'REQUIREMENTS' &&
                                                            desc.isActive,
                                                    ).length > 0 ? (
                                                        job.jobDescriptions
                                                            .filter(
                                                                (desc) =>
                                                                    desc.type ===
                                                                        'REQUIREMENTS' &&
                                                                    desc.isActive,
                                                            )
                                                            .map((req) => (
                                                                <List.Item
                                                                    key={req.id}
                                                                    icon={
                                                                        <IconCheck
                                                                            size={
                                                                                14
                                                                            }
                                                                            color={
                                                                                theme
                                                                                    .colors
                                                                                    .teal[5]
                                                                            }
                                                                        />
                                                                    }
                                                                >
                                                                    {
                                                                        req.description
                                                                    }
                                                                </List.Item>
                                                            ))
                                                    ) : (
                                                        <Text
                                                            size="xs"
                                                            color="dimmed"
                                                        >
                                                            No requirements
                                                            provided
                                                        </Text>
                                                    )}
                                                </List>
                                            </Stack>

                                            <Stack gap="xs">
                                                <Title order={4}>
                                                    Responsibilities
                                                </Title>
                                                <List size="xs" color="dimmed">
                                                    {job.jobDescriptions?.filter(
                                                        (desc) =>
                                                            desc.type ===
                                                                'RESPONSIBILITY' &&
                                                            desc.isActive,
                                                    ).length > 0 ? (
                                                        job.jobDescriptions
                                                            .filter(
                                                                (desc) =>
                                                                    desc.type ===
                                                                        'RESPONSIBILITY' &&
                                                                    desc.isActive,
                                                            )
                                                            .map((resp) => (
                                                                <List.Item
                                                                    key={
                                                                        resp.id
                                                                    }
                                                                    icon={
                                                                        <IconCheck
                                                                            size={
                                                                                14
                                                                            }
                                                                            color={
                                                                                theme
                                                                                    .colors
                                                                                    .teal[5]
                                                                            }
                                                                        />
                                                                    }
                                                                >
                                                                    {
                                                                        resp.description
                                                                    }
                                                                </List.Item>
                                                            ))
                                                    ) : (
                                                        <Text
                                                            size="xs"
                                                            color="dimmed"
                                                        >
                                                            No responsibilities
                                                            provided
                                                        </Text>
                                                    )}
                                                </List>
                                            </Stack>

                                            <Stack gap="xs">
                                                <Title order={4}>
                                                    Benefits
                                                </Title>
                                                <List size="xs" color="dimmed">
                                                    {job.jobDescriptions?.filter(
                                                        (desc) =>
                                                            desc.type ===
                                                                'BENEFITS' &&
                                                            desc.isActive,
                                                    ).length > 0 ? (
                                                        job.jobDescriptions
                                                            .filter(
                                                                (desc) =>
                                                                    desc.type ===
                                                                        'BENEFITS' &&
                                                                    desc.isActive,
                                                            )
                                                            .map((benefit) => (
                                                                <List.Item
                                                                    key={
                                                                        benefit.id
                                                                    }
                                                                    icon={
                                                                        <IconCheck
                                                                            size={
                                                                                14
                                                                            }
                                                                            color={
                                                                                theme
                                                                                    .colors
                                                                                    .teal[5]
                                                                            }
                                                                        />
                                                                    }
                                                                >
                                                                    {
                                                                        benefit.description
                                                                    }
                                                                </List.Item>
                                                            ))
                                                    ) : (
                                                        <Text
                                                            size="xs"
                                                            color="dimmed"
                                                        >
                                                            No benefits provided
                                                        </Text>
                                                    )}
                                                </List>
                                            </Stack>

                                            <Stack gap="xs">
                                                <Title order={4}>
                                                    Skills & Expertise
                                                </Title>
                                                <Group gap="xs">
                                                    {job.jobSkills?.filter(
                                                        (skill) =>
                                                            skill.isActive,
                                                    ).length > 0 ? (
                                                        job.jobSkills
                                                            .filter(
                                                                (skill) =>
                                                                    skill.isActive,
                                                            )
                                                            .map((skill) => (
                                                                <Badge
                                                                    key={
                                                                        skill.id
                                                                    }
                                                                    variant="outline"
                                                                >
                                                                    {
                                                                        skill.skill
                                                                    }
                                                                </Badge>
                                                            ))
                                                    ) : (
                                                        <Text
                                                            size="xs"
                                                            color="dimmed"
                                                        >
                                                            No skills provided
                                                        </Text>
                                                    )}
                                                </Group>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Tabs.Panel>

                                <Tabs.Panel value="application" pt="md">
                                    <form
                                        onSubmit={handleSubmitApplication}
                                        className="w-full"
                                    >
                                        <Stack gap="xl">
                                            {/* Personal Information */}
                                            <Stack gap="sm">
                                                <Group
                                                    justify={'space-between'}
                                                >
                                                    <Title
                                                        visibleFrom="md"
                                                        order={4}
                                                        hiddenFrom="md"
                                                    >
                                                        Personal Information
                                                    </Title>
                                                    <Badge
                                                        color="green"
                                                        variant="light"
                                                        size="xs"
                                                        leftSection={
                                                            <IconCheck
                                                                size={12}
                                                            />
                                                        }
                                                    >
                                                        Auto-filled
                                                    </Badge>
                                                </Group>

                                                <SimpleGrid
                                                    cols={{ base: 1, md: 2 }}
                                                >
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
                                                        defaultValue={
                                                            user?.updatedBy
                                                        }
                                                        readOnly
                                                    />
                                                </SimpleGrid>
                                            </Stack>

                                            {/* Experience */}
                                            <Stack gap="sm">
                                                <Title
                                                    visibleFrom="md"
                                                    order={4}
                                                    hiddenFrom="md"
                                                >
                                                    Experience & Preferences
                                                </Title>

                                                <SimpleGrid
                                                    cols={{ base: 1, md: 2 }}
                                                >
                                                    <Select
                                                        label="Years of Experience"
                                                        size="xs"
                                                        data={[
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
                                                        ]}
                                                        defaultValue="3-5 years"
                                                    />
                                                    <Select
                                                        label="Availability to Start"
                                                        size="xs"
                                                        data={[
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
                                                        ]}
                                                        defaultValue="2 weeks"
                                                    />
                                                </SimpleGrid>

                                                <SimpleGrid
                                                    cols={{ base: 1, md: 2 }}
                                                >
                                                    <Stack gap="sm">
                                                        <Text size="xs">
                                                            Willing to Relocate?
                                                        </Text>
                                                        <Radio.Group
                                                            defaultValue="no"
                                                            size="xs"
                                                        >
                                                            <Stack gap="xs">
                                                                <Radio
                                                                    value="yes"
                                                                    label="Yes"
                                                                />
                                                                <Radio
                                                                    value="no"
                                                                    label="No"
                                                                />
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
                                                    Salary range for this
                                                    position: $120,000 -
                                                    $150,000
                                                </Text>
                                            </Stack>

                                            {/* Documents */}
                                            <Stack gap="sm">
                                                <Group
                                                    justify={'space-between'}
                                                >
                                                    <Title order={4}>
                                                        Documents
                                                    </Title>
                                                    <Tooltip label="Upload your resume and any other relevant documents. Accepted formats: PDF, DOC, DOCX. Maximum 5MB per file.">
                                                        <ActionIcon size="xs">
                                                            <IconHelp
                                                                size={14}
                                                            />
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
                                                        <Paper
                                                            key={file.id}
                                                            p="sm"
                                                            withBorder
                                                        >
                                                            <Group
                                                                justify={
                                                                    'space-between'
                                                                }
                                                            >
                                                                <Group
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={() => {
                                                                        if (
                                                                            cv
                                                                        ) {
                                                                            handleViewResume(
                                                                                cv,
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    <IconFileText
                                                                        size={
                                                                            16
                                                                        }
                                                                        color="gray"
                                                                    />
                                                                    <Stack
                                                                        gap={0}
                                                                    >
                                                                        <Text size="xs">
                                                                            {
                                                                                file.name
                                                                            }
                                                                        </Text>
                                                                        <Text
                                                                            size="xs"
                                                                            color="dimmed"
                                                                        >
                                                                            {
                                                                                file.size
                                                                            }
                                                                        </Text>
                                                                    </Stack>
                                                                    {file.type ===
                                                                        'resume' && (
                                                                        <Badge
                                                                            color="green"
                                                                            variant="light"
                                                                            size="xs"
                                                                        >
                                                                            Primary
                                                                            Resume
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
                                                <Group
                                                    justify={'space-between'}
                                                >
                                                    <Title
                                                        visibleFrom="md"
                                                        order={4}
                                                        hiddenFrom="md"
                                                    >
                                                        Cover Letter
                                                    </Title>
                                                    <Text
                                                        span
                                                        color="dimmed"
                                                        size="xs"
                                                    >
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
                                                    Adding a personalized cover
                                                    letter increases your chance
                                                    of getting an interview by
                                                    40%.
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

                                            <Group grow>
                                                {!job?.applied && (
                                                    <Flex justify={'end'}>
                                                        <Button
                                                            w={'50%'}
                                                            type="submit"
                                                            size="xs"
                                                            loading={
                                                                applyMutation.isPending
                                                            }
                                                            disabled={
                                                                applyMutation.isPending
                                                            }
                                                        >
                                                            Apply Now
                                                        </Button>
                                                    </Flex>
                                                )}
                                            </Group>
                                        </Stack>
                                    </form>
                                </Tabs.Panel>
                            </Tabs>
                        </Card>
                    </Stack>

                    {/* Sidebar */}
                    <Box
                        w={{ base: '100%', md: 400 }}
                        miw={{ base: '100%', md: 400 }}
                        maw={{ base: '100%', md: 400 }}
                        flex={1}
                    >
                        <Stack gap="lg">
                            <Card>
                                <Stack gap="sm">
                                    <Title order={4}>
                                        Application Progress
                                    </Title>
                                    <Stack gap="xs">
                                        <Group justify={'space-between'}>
                                            <Text size="xs">
                                                Profile Information
                                            </Text>
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
                                        </Group>
                                        <Group justify={'space-between'}>
                                            <Text size="xs">Resume/CV</Text>
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
                                        </Group>
                                        <Group justify={'space-between'}>
                                            <Text size="xs">
                                                Experience Details
                                            </Text>
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
                                        </Group>
                                        <Group justify={'space-between'}>
                                            <Text size="xs">Cover Letter</Text>
                                            <Badge
                                                color="orange"
                                                variant="light"
                                                size="xs"
                                            >
                                                Missing
                                            </Badge>
                                        </Group>
                                        <Group justify={'space-between'}>
                                            <Text size="xs">Preferences</Text>
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
                                        </Group>
                                    </Stack>
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        size="xs"
                                        onClick={() =>
                                            setActiveTab('application')
                                        }
                                        hidden
                                    >
                                        Continue Application
                                    </Button>
                                </Stack>
                            </Card>

                            <Card>
                                <Stack gap="sm">
                                    <Title order={4}>
                                        Organization Details
                                    </Title>
                                    <Group gap="md" wrap="nowrap">
                                        <Avatar
                                            radius="md"
                                            src="/placeholder.svg"
                                            alt="Company Logo"
                                        />
                                        <Stack gap={0}>
                                            <Title order={4}>
                                                {job.organization?.name}
                                            </Title>
                                            <Text size="xs" color="dimmed">
                                                Technology · 500-1000 employees
                                                · Founded 2010
                                            </Text>
                                            <Group gap="xs" mt={4}>
                                                <Rating
                                                    value={4.5}
                                                    fractions={2}
                                                    readOnly
                                                    size="xs"
                                                />
                                                <Text size="xs" color="dimmed">
                                                    4.5 (126 reviews)
                                                </Text>
                                            </Group>
                                        </Stack>
                                    </Group>

                                    <Divider my="sm" />

                                    <Button
                                        variant="outline"
                                        fullWidth
                                        size="xs"
                                        hidden
                                    >
                                        View company profile
                                    </Button>
                                </Stack>
                            </Card>

                            <Card>
                                <Stack gap="sm">
                                    <Title order={4}>Similar Jobs</Title>
                                    {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation> */}
                                    {[1, 2, 3].map((job) => (
                                        <Stack
                                            key={job}
                                            gap={4}
                                            pb="sm"
                                            style={{
                                                borderBottom: '1px solid #eee',
                                            }}
                                        >
                                            <Anchor size="xs">
                                                {job === 1
                                                    ? 'Frontend Developer'
                                                    : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                      job === 2
                                                      ? 'UI Engineer'
                                                      : 'React Developer'}
                                            </Anchor>
                                            <Group gap="xs">
                                                <IconBuilding
                                                    size={14}
                                                    color="gray"
                                                />
                                                <Text size="xs" color="dimmed">
                                                    {job === 1
                                                        ? 'WebSolutions Ltd.'
                                                        : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                          job === 2
                                                          ? 'DesignHub Inc.'
                                                          : 'AppWorks Co.'}
                                                </Text>
                                            </Group>
                                            <Group gap="sm" wrap="wrap">
                                                <Group gap={4}>
                                                    <IconMapPin
                                                        size={14}
                                                        color="gray"
                                                    />
                                                    <Text
                                                        size="xs"
                                                        color="dimmed"
                                                    >
                                                        {job === 1
                                                            ? 'Remote'
                                                            : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                              job === 2
                                                              ? 'New York, NY'
                                                              : 'Austin, TX'}
                                                    </Text>
                                                </Group>
                                                <Group gap={4}>
                                                    <IconCurrencyDollar
                                                        size={14}
                                                        color="gray"
                                                    />
                                                    <Text
                                                        size="xs"
                                                        color="dimmed"
                                                    >
                                                        {job === 1
                                                            ? '$90-120K'
                                                            : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                              job === 2
                                                              ? '$100-130K'
                                                              : '$110-140K'}
                                                    </Text>
                                                </Group>
                                            </Group>
                                            <Badge variant="outline" size="xs">
                                                90% match
                                            </Badge>
                                        </Stack>
                                    ))}
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        size="xs"
                                        hidden
                                    >
                                        View more jobs
                                    </Button>
                                </Stack>
                            </Card>

                            <Card hidden>
                                <Stack gap="sm">
                                    <Title order={4}>Application Tips</Title>
                                    <Stack gap="xs">
                                        <Text size="xs" fw={500}>
                                            Highlight Relevant Skills
                                        </Text>
                                        <Text size="xs" color="dimmed">
                                            Make sure your resume emphasizes
                                            your experience with React,
                                            TypeScript, and front-end
                                            development.
                                        </Text>
                                    </Stack>
                                    <Stack gap="xs">
                                        <Text size="xs" fw={500}>
                                            Personalize Your Application
                                        </Text>
                                        <Text size="xs" color="dimmed">
                                            Add a cover letter explaining why
                                            you&pos;re a good fit for TechCorp
                                            specifically.
                                        </Text>
                                    </Stack>
                                    <Stack gap="xs">
                                        <Text size="xs" fw={500}>
                                            Follow Up
                                        </Text>
                                        <Text size="xs" color="dimmed">
                                            If you don&pos;t hear back within 7
                                            days, consider a polite follow-up.
                                        </Text>
                                    </Stack>
                                </Stack>
                            </Card>
                        </Stack>
                    </Box>
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

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
    Checkbox,
    Container,
    Divider,
    FileInput,
    Flex,
    Group,
    List,
    LoadingOverlay,
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
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { logger } from '@shega/shared';
import { useAuth } from '@shega/ui';
import {
    IconAlertCircle,
    IconBuilding,
    IconCalendar,
    IconCheck,
    IconClock,
    IconCurrencyDollar,
    IconDeviceFloppy,
    IconFileText,
    IconHelp,
    IconMapPin,
    IconUpload,
} from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { applyJobs } from 'app/_api/jobs/apply-job';
import { fetchJobsById } from 'app/_api/jobs/fetch-job-id';
import parse from 'html-react-parser';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function JobDetailsPage() {
    const params = useParams<{ id: string }>();
    const locale = useLocale();
    const t = useTranslations('jobListing');
    const isMobile = useMediaQuery('(max-width: 768px)');
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [applicationProgress, setApplicationProgress] = useState(60);
    const { user } = useAuth();

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
            router.push('/applications');
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

    const applicationStatus = 'in-progress';

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'not-started':
                return 'Not Started';
            case 'in-progress':
                return 'In Progress';
            case 'submitted':
                return 'Submitted';
            case 'under-review':
                return 'Under Review';
            default:
                return 'Unknown';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'not-started':
                return 'gray';
            case 'in-progress':
                return 'orange';
            case 'submitted':
                return 'green';
            case 'under-review':
                return 'violet';
            default:
                return 'gray';
        }
    };

    return (
        <>
            <Container size="xl" py="xl">
                {/* Application Status Bar */}
                <Flex justify={'space-between'} align={'start'} gap="md">
                    <Group gap={'md'}>
                        <Card className="w-full">
                            <Group justify={'space-between'}>
                                <Stack gap="xs">
                                    <Title order={5}>Application Status</Title>
                                    <Group>
                                        <Badge
                                            color={getStatusColor(
                                                applicationStatus,
                                            )}
                                        >
                                            {getStatusLabel(applicationStatus)}
                                        </Badge>
                                        <Text size="sm" color="dimmed">
                                            Last saved 2 hours ago
                                        </Text>
                                    </Group>
                                </Stack>

                                <Stack gap="xs" w={200}>
                                    <Group justify={'space-between'}>
                                        <Text size="sm">Progress</Text>
                                        <Text size="sm">
                                            {applicationProgress}%
                                        </Text>
                                    </Group>
                                    <Progress
                                        value={applicationProgress}
                                        size="sm"
                                    />
                                </Stack>
                            </Group>
                        </Card>

                        {/* Main Content */}
                        <Card bg={'white'} className="!w-full">
                            <Tabs
                                value={activeTab}
                                onChange={(value) =>
                                    setActiveTab(value || 'overview')
                                }
                            >
                                <Tabs.List>
                                    <Tabs.Tab value="overview">
                                        Overview
                                    </Tabs.Tab>
                                    <Tabs.Tab value="application">
                                        Application
                                    </Tabs.Tab>
                                </Tabs.List>

                                <Tabs.Panel value="overview" pt="md">
                                    <Stack gap="md">
                                        <Group>
                                            <Avatar
                                                size="lg"
                                                radius="md"
                                                src="/placeholder.svg"
                                                alt="TechCorp Logo"
                                            />
                                            <Stack gap={0}>
                                                <Title order={3}>
                                                    {job.title}
                                                </Title>
                                                <Group gap="xs">
                                                    <Group gap={4}>
                                                        <IconBuilding
                                                            size={16}
                                                            color="gray"
                                                        />
                                                        <Text
                                                            size="sm"
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
                                                    />
                                                    <Text
                                                        size="sm"
                                                        color="dimmed"
                                                    >
                                                        4.5 (126 reviews)
                                                    </Text>
                                                </Group>
                                                <Group gap="md" mt={4}>
                                                    <Group gap={4}>
                                                        <IconMapPin
                                                            size={16}
                                                            color="gray"
                                                        />
                                                        <Text
                                                            size="sm"
                                                            color="dimmed"
                                                        >
                                                            {job.workPlace ||
                                                                'Remote'}
                                                        </Text>
                                                    </Group>
                                                    <Group gap={4}>
                                                        <IconCurrencyDollar
                                                            size={16}
                                                            color="gray"
                                                        />
                                                        <Text
                                                            size="sm"
                                                            color="dimmed"
                                                        >
                                                            {job.salaryFrom.toLocaleString()}{' '}
                                                            -{' '}
                                                            {job.salaryTo.toLocaleString()}{' '}
                                                            {job.currency}
                                                        </Text>
                                                    </Group>
                                                    <Group gap={4}>
                                                        <IconClock
                                                            size={16}
                                                            color="gray"
                                                        />
                                                        <Text
                                                            size="sm"
                                                            color="dimmed"
                                                        >
                                                            {job.type}
                                                        </Text>
                                                    </Group>
                                                    <Group gap={4}>
                                                        <IconCalendar
                                                            size={16}
                                                            color="gray"
                                                        />
                                                        <Text
                                                            size="sm"
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
                                                    <Title order={4}>
                                                        Job Description
                                                    </Title>
                                                    <Badge>New</Badge>
                                                </Group>
                                                <TypographyStylesProvider>
                                                    <Box className="prose prose-stone max-w-none">
                                                        {parse(job.description)}
                                                    </Box>
                                                </TypographyStylesProvider>
                                            </Stack>

                                            <Stack gap="xs">
                                                <Title order={4}>
                                                    Responsibilities
                                                </Title>
                                                <List size="sm" color="dimmed">
                                                    {job.responsibilities?.map(
                                                        (
                                                            req: string,
                                                            index: number,
                                                        ) => (
                                                            <List.Item
                                                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                                key={index}
                                                            >
                                                                {req}
                                                            </List.Item>
                                                        ),
                                                    )}
                                                </List>
                                            </Stack>

                                            <Stack gap="xs">
                                                <Title order={4}>
                                                    Requirements
                                                </Title>
                                                <List size="sm" color="dimmed">
                                                    {job.requirements?.map(
                                                        (
                                                            req: string,
                                                            index: number,
                                                        ) => (
                                                            <List.Item
                                                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                                key={index}
                                                            >
                                                                {req}
                                                            </List.Item>
                                                        ),
                                                    )}
                                                </List>
                                            </Stack>

                                            <Stack gap="xs">
                                                <Title order={4}>
                                                    Skills & Expertise
                                                </Title>
                                                <Group gap="xs">
                                                    {[
                                                        'React',
                                                        'TypeScript',
                                                        'Next.js',
                                                        'Redux',
                                                        'HTML5',
                                                        'CSS3',
                                                        'JavaScript',
                                                        'REST APIs',
                                                        'Responsive Design',
                                                        'UI/UX',
                                                    ].map((skill) => (
                                                        <Badge
                                                            key={skill}
                                                            variant="outline"
                                                        >
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </Group>
                                            </Stack>

                                            <Stack gap="xs">
                                                <Title order={4}>
                                                    Benefits
                                                </Title>
                                                <List size="sm" color="dimmed">
                                                    <List.Item>
                                                        Competitive salary and
                                                        equity package
                                                    </List.Item>
                                                    <List.Item>
                                                        Health, dental, and
                                                        vision insurance
                                                    </List.Item>
                                                    <List.Item>
                                                        401(k) matching
                                                    </List.Item>
                                                    <List.Item>
                                                        Flexible working hours
                                                        and remote work options
                                                    </List.Item>
                                                    <List.Item>
                                                        Professional development
                                                        budget
                                                    </List.Item>
                                                    <List.Item>
                                                        Unlimited PTO policy
                                                    </List.Item>
                                                    <List.Item>
                                                        Home office stipend
                                                    </List.Item>
                                                    <List.Item>
                                                        Team retreats and social
                                                        events
                                                    </List.Item>
                                                </List>
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
                                                    <Title order={4}>
                                                        Personal Information
                                                    </Title>
                                                    <Badge
                                                        color="green"
                                                        variant="light"
                                                        leftSection={
                                                            <IconCheck
                                                                size={12}
                                                            />
                                                        }
                                                    >
                                                        Auto-filled
                                                    </Badge>
                                                </Group>

                                                <SimpleGrid cols={2}>
                                                    <TextInput
                                                        label="Full Name"
                                                        name="fullName"
                                                        defaultValue="Alex Johnson"
                                                    />
                                                    <TextInput
                                                        label="Email"
                                                        name="email"
                                                        type="email"
                                                        defaultValue="alex.johnson@example.com"
                                                    />
                                                    <TextInput
                                                        label="Phone Number"
                                                        name="phone"
                                                        defaultValue="(555) 123-4567"
                                                    />
                                                    <TextInput
                                                        label="Portfolio Website"
                                                        name="portfolio"
                                                        defaultValue="https://alexjohnson.dev"
                                                    />
                                                </SimpleGrid>
                                            </Stack>

                                            {/* Experience */}
                                            <Stack gap="sm">
                                                <Title order={4}>
                                                    Experience & Preferences
                                                </Title>

                                                <SimpleGrid cols={2}>
                                                    <Select
                                                        label="Years of Experience"
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

                                                <SimpleGrid cols={2}>
                                                    <Stack gap="sm">
                                                        <Text size="sm">
                                                            Willing to Relocate?
                                                        </Text>
                                                        <Radio.Group defaultValue="no">
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
                                                        <ActionIcon>
                                                            <IconHelp
                                                                size={16}
                                                            />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </Group>

                                                <Stack gap="sm">
                                                    {[
                                                        {
                                                            id: 1,
                                                            name: 'Alex_Johnson_Resume.pdf',
                                                            size: '1.2 MB',
                                                            type: 'resume',
                                                            uploaded: true,
                                                        },
                                                        {
                                                            id: 2,
                                                            name: 'Portfolio_2023.pdf',
                                                            size: '3.7 MB',
                                                            type: 'portfolio',
                                                            uploaded: true,
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
                                                                <Group>
                                                                    <IconFileText
                                                                        size={
                                                                            20
                                                                        }
                                                                        color="gray"
                                                                    />
                                                                    <Stack
                                                                        gap={0}
                                                                    >
                                                                        <Text size="sm">
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
                                                                        >
                                                                            Primary
                                                                            Resume
                                                                        </Badge>
                                                                    )}
                                                                </Group>
                                                                <Button
                                                                    variant="subtle"
                                                                    color="red"
                                                                    size="sm"
                                                                >
                                                                    Remove
                                                                </Button>
                                                            </Group>
                                                        </Paper>
                                                    ))}

                                                    <FileInput
                                                        placeholder="Drop files here or click to upload"
                                                        leftSection={
                                                            <IconUpload
                                                                size={14}
                                                            />
                                                        }
                                                        accept=".pdf,.doc,.docx"
                                                        description="Attach additional documents (optional)"
                                                    />
                                                </Stack>
                                            </Stack>

                                            {/* Cover Letter */}
                                            <Stack gap="sm">
                                                <Group
                                                    justify={'space-between'}
                                                >
                                                    <Title order={4}>
                                                        Cover Letter{' '}
                                                        <Text
                                                            span
                                                            color="dimmed"
                                                            size="sm"
                                                        >
                                                            (Optional)
                                                        </Text>
                                                    </Title>
                                                    <Badge
                                                        color="orange"
                                                        variant="light"
                                                        leftSection={
                                                            <IconAlertCircle
                                                                size={12}
                                                            />
                                                        }
                                                    >
                                                        Recommended
                                                    </Badge>
                                                </Group>
                                                <Textarea
                                                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                                                    minRows={6}
                                                    name="coverLetter"
                                                />
                                                <Text size="xs" color="dimmed">
                                                    Adding a personalized cover
                                                    letter increases your chance
                                                    of getting an interview by
                                                    40%.
                                                </Text>
                                            </Stack>

                                            {/* Legal */}
                                            <Checkbox
                                                label={
                                                    <>
                                                        I agree to the terms and
                                                        conditions. By applying,
                                                        you agree to our{' '}
                                                        <Anchor
                                                            href="#"
                                                            size="sm"
                                                        >
                                                            Privacy Policy
                                                        </Anchor>{' '}
                                                        and{' '}
                                                        <Anchor
                                                            href="#"
                                                            size="sm"
                                                        >
                                                            Terms of Service
                                                        </Anchor>
                                                    </>
                                                }
                                                defaultChecked
                                                required
                                            />

                                            <Group grow>
                                                <Button
                                                    variant="default"
                                                    leftSection={
                                                        <IconDeviceFloppy
                                                            size={16}
                                                        />
                                                    }
                                                    onClick={() => {
                                                        // Save as draft functionality
                                                        setApplicationProgress(
                                                            60,
                                                        );
                                                        notifications.show({
                                                            title: 'Draft Saved',
                                                            message:
                                                                'Your application has been saved as a draft.',
                                                            color: 'blue',
                                                        });
                                                    }}
                                                >
                                                    Save as Draft
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    loading={
                                                        applyMutation.isPending
                                                    }
                                                    disabled={
                                                        applyMutation.isPending
                                                    }
                                                >
                                                    Submit Application
                                                </Button>
                                            </Group>
                                        </Stack>
                                    </form>
                                </Tabs.Panel>
                            </Tabs>
                        </Card>
                    </Group>

                    {/* Sidebar */}
                    <Box
                        style={{
                            flex: 1,
                            minWidth: 400,
                            width: 400,
                            maxWidth: 400,
                        }}
                    >
                        <Stack gap="lg">
                            <Card>
                                <Stack gap="sm">
                                    <Title order={5}>
                                        Application Progress
                                    </Title>
                                    <Stack gap="xs">
                                        <Group justify={'space-between'}>
                                            <Text size="sm">
                                                Profile Information
                                            </Text>
                                            <Badge
                                                color="green"
                                                variant="light"
                                                leftSection={
                                                    <IconCheck size={12} />
                                                }
                                            >
                                                Complete
                                            </Badge>
                                        </Group>
                                        <Group justify={'space-between'}>
                                            <Text size="sm">Resume/CV</Text>
                                            <Badge
                                                color="green"
                                                variant="light"
                                                leftSection={
                                                    <IconCheck size={12} />
                                                }
                                            >
                                                Complete
                                            </Badge>
                                        </Group>
                                        <Group justify={'space-between'}>
                                            <Text size="sm">
                                                Experience Details
                                            </Text>
                                            <Badge
                                                color="green"
                                                variant="light"
                                                leftSection={
                                                    <IconCheck size={12} />
                                                }
                                            >
                                                Complete
                                            </Badge>
                                        </Group>
                                        <Group justify={'space-between'}>
                                            <Text size="sm">Cover Letter</Text>
                                            <Badge
                                                color="orange"
                                                variant="light"
                                            >
                                                Missing
                                            </Badge>
                                        </Group>
                                        <Group justify={'space-between'}>
                                            <Text size="sm">Preferences</Text>
                                            <Badge
                                                color="green"
                                                variant="light"
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
                                        onClick={() =>
                                            setActiveTab('application')
                                        }
                                    >
                                        Continue Application
                                    </Button>
                                </Stack>
                            </Card>

                            <Card>
                                <Stack gap="sm">
                                    <Title order={5}>
                                        Organization Details
                                    </Title>
                                    <Group gap="md">
                                        <Avatar
                                            size="lg"
                                            radius="md"
                                            src="/placeholder.svg"
                                            alt="Company Logo"
                                        />
                                        <Stack gap={0}>
                                            <Title order={4}>
                                                {job.organization?.name}
                                            </Title>
                                            <Text size="sm" color="dimmed">
                                                Technology · 500-1000 employees
                                                · Founded 2010
                                            </Text>
                                            <Group gap="xs" mt={4}>
                                                <Rating
                                                    value={4.5}
                                                    fractions={2}
                                                    readOnly
                                                />
                                                <Text size="sm" color="dimmed">
                                                    4.5 (126 reviews)
                                                </Text>
                                            </Group>
                                        </Stack>
                                    </Group>

                                    <Divider my="sm" />

                                    {/* <Stack gap="xs">
                    <Title order={5}>About the company</Title>
                    <Text size="sm" color="dimmed">
                      {job.organization?.description ||
                        "TechCorp is a leading technology company specializing in cloud-based solutions and innovative software products. Founded in 2010, we've grown from a small startup to an industry leader with offices across the globe."}
                    </Text>
                  </Stack>

                  <SimpleGrid cols={2} spacing="xs">
                    <Card shadow="sm" p="sm">
                      <Text size="sm" color="dimmed">
                        Industry
                      </Text>
                      <Text fw={500}>Technology</Text>
                    </Card>
                    <Card shadow="sm" p="sm">
                      <Text size="sm" color="dimmed">
                        Company size
                      </Text>
                      <Text fw={500}>500-1000</Text>
                    </Card>
                    <Card shadow="sm" p="sm">
                      <Text size="sm" color="dimmed">
                        Founded
                      </Text>
                      <Text fw={500}>2010</Text>
                    </Card>
                    <Card shadow="sm" p="sm">
                      <Text size="sm" color="dimmed">
                        Revenue
                      </Text>
                      <Text fw={500}>$50M-$100M</Text>
                    </Card>
                  </SimpleGrid>

                  <Stack gap="xs">
                    <Title order={5}>Company culture</Title>
                    <SimpleGrid cols={2}>
                      <Stack gap="xs">
                        <Text size="sm">Work-Life Balance</Text>
                        <Progress value={90} size="sm" />
                        <Text size="sm" color="dimmed" ta="right">
                          9/10
                        </Text>
                      </Stack>
                      <Stack gap="xs">
                        <Text size="sm">Professional Growth</Text>
                        <Progress value={85} size="sm" />
                        <Text size="sm" color="dimmed" ta="right">
                          8.5/10
                        </Text>
                      </Stack>
                      <Stack gap="xs">
                        <Text size="sm">Compensation & Benefits</Text>
                        <Progress value={95} size="sm" />
                        <Text size="sm" color="dimmed" ta="right">
                          9.5/10
                        </Text>
                      </Stack>
                      <Stack gap="xs">
                        <Text size="sm">Company Culture</Text>
                        <Progress value={90} size="sm" />
                        <Text size="sm" color="dimmed" ta="right">
                          9/10
                        </Text>
                      </Stack>
                    </SimpleGrid>
                  </Stack> */}

                                    <Button variant="outline" fullWidth>
                                        View company profile
                                    </Button>
                                </Stack>
                            </Card>

                            <Card>
                                <Stack gap="sm">
                                    <Title order={5}>Similar Jobs</Title>
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
                                            <Anchor size="sm">
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
                                            <Group gap="sm">
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
                                            <Badge variant="outline">
                                                90% match
                                            </Badge>
                                        </Stack>
                                    ))}
                                    <Button variant="outline" fullWidth>
                                        View more jobs
                                    </Button>
                                </Stack>
                            </Card>

                            <Card>
                                <Stack gap="sm">
                                    <Title order={5}>Application Tips</Title>
                                    <Stack gap="xs">
                                        <Text size="sm" fw={500}>
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
                                        <Text size="sm" fw={500}>
                                            Personalize Your Application
                                        </Text>
                                        <Text size="xs" color="dimmed">
                                            Add a cover letter explaining why
                                            you&pos;re a good fit for TechCorp
                                            specifically.
                                        </Text>
                                    </Stack>
                                    <Stack gap="xs">
                                        <Text size="sm" fw={500}>
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
        </>
    );
}

'use client';

import { useCanApply } from '@/hooks/can-apply.hook';
import {
    ActionIcon,
    Badge,
    Blockquote,
    Button,
    Flex,
    Group,
    NumberInput,
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
import { Controller, useForm } from 'react-hook-form';

type JobApplicationPanelProps = {
    job: Job;
    setCvUrl: (value: string) => void;
    setApplicationProgress: (value: number) => void;
};

type FormData = {
    coverLetter: string;
    noticePeriod: number;
    relocationOption: string;
    experience: number;
    salaryExpectation?: number | null;
};

// Notice period options in days
const noticePeriodOptions = [
    { value: '0', label: 'Immediately' },
    { value: '7', label: '1 week' },
    { value: '14', label: '2 weeks' },
    { value: '30', label: '1 month' },
    { value: '60', label: '2 months' },
    { value: '90', label: '3 months' },
];

export const JobApplicationPanel = ({
    job,
    setCvUrl,
    setApplicationProgress,
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
}: JobApplicationPanelProps) => {
    const { user } = useAuth();
    const router = useRouter();
    const { canApply, isLoading } = useCanApply();
    const { data: jobSeekerData } = useJobSeekerDetails();
    const { data: cv } = useDownloadProfilePicture(jobSeekerData?.cv ?? '');

    // Check if application is already submitted
    const isApplicationSubmitted = job?.applied === true;
    const isFormReadonly = isApplicationSubmitted;

    // React Hook Form setup
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<FormData>({
        defaultValues: {
            coverLetter: job?.applicationData?.coverLetter || '',
            noticePeriod: job?.applicationData?.noticePeriod || 0,
            relocationOption: job?.applicationData?.relocationOption || 'NO',
            experience: job?.applicationData?.experience || 0,
            salaryExpectation: job?.applicationData?.salaryExpectation || null,
        },
        mode: 'onChange',
    });

    const applyMutation = useMutation({
        mutationFn: (payload: {
            coverLetter: string;
            noticePeriod: number;
            relocationOption: string;
            salaryExpectation?: number | null;
        }) => {
            if (!job?.programId) {
                throw new Error('Missing program ID');
            }
            return applyJobs(job.programId, payload);
        },
        onSuccess: () => {
            setApplicationProgress(100);
            notifications.show({
                title: 'Application Submitted',
                message: 'Your application has been successfully submitted.',
                color: 'green',
                icon: <IconCheck size={16} />,
            });
            router.push('/jobs');
        },
        onError: (error) => {
            notifications.show({
                title: 'Application Failed',
                message:
                    'There was an error submitting your application. Please try again.',
                color: 'red',
            });
            logger.error('Application error:', error);
        },
    });

    const onSubmit = (data: FormData) => {
        if (!user) {
            router.push('/auth/login');
            return;
        }

        if (isFormReadonly) {
            return;
        }

        const payload = {
            coverLetter: data.coverLetter,
            noticePeriod: data.noticePeriod,
            relocationOption: data.relocationOption,
            salaryExpectation: data.salaryExpectation || null,
        };

        applyMutation.mutate(payload);
    };

    const handleViewResume = (file: Blob) => {
        const url = URL.createObjectURL(file);
        setCvUrl(url);
    };

    const formatSalary = (value?: number | null) => {
        if (!value) {
            return 'Not specified';
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getNoticePeriodLabel = (value: number) => {
        const option = noticePeriodOptions.find(
            (opt) => opt.value === value.toString(),
        );
        return option?.label || `${value} days`;
    };

    const getRelocationLabel = (value: string) => {
        switch (value) {
            case 'YES':
                return 'Yes';
            case 'NO':
                return 'No';
            case 'NA':
                return 'Maybe, depending on location';
            default:
                return value;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Stack gap="xl">
                {/* Personal Information */}
                <Stack gap="sm">
                    <Group justify="space-between">
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
                            value={`${user?.firstName} ${user?.lastName}`}
                            readOnly
                        />
                        <TextInput
                            label="Email"
                            name="email"
                            type="email"
                            size="xs"
                            value={user?.user?.email}
                            readOnly
                        />
                    </SimpleGrid>
                </Stack>

                {/* Experience & Preferences */}
                <Stack gap="sm">
                    <Group justify="space-between">
                        <Title visibleFrom="md" order={4} hiddenFrom="md">
                            Experience & Preferences
                        </Title>
                        {isApplicationSubmitted && (
                            <Badge color="blue" variant="light" size="xs">
                                Application Submitted
                            </Badge>
                        )}
                    </Group>
                    <SimpleGrid cols={{ base: 1, md: 2 }}>
                        <Controller
                            name="experience"
                            control={control}
                            rules={{
                                required: isFormReadonly
                                    ? false
                                    : 'Experience is required',
                                min: {
                                    value: 0,
                                    message: 'Experience cannot be negative',
                                },
                            }}
                            render={({ field }) => (
                                <>
                                    {isFormReadonly ? (
                                        <TextInput
                                            label="Years of Experience"
                                            size="xs"
                                            value={`${field.value} years`}
                                            readOnly
                                        />
                                    ) : (
                                        <NumberInput
                                            label="Years of Experience"
                                            size="xs"
                                            value={field.value?.toString()}
                                            onChange={(value) =>
                                                field.onChange(
                                                    Number.parseInt(
                                                        String(value) || '0',
                                                    ),
                                                )
                                            }
                                            error={errors.experience?.message}
                                        />
                                    )}
                                </>
                            )}
                        />
                        <Controller
                            name="noticePeriod"
                            control={control}
                            rules={{
                                required: isFormReadonly
                                    ? false
                                    : 'Notice period is required',
                                min: {
                                    value: 0,
                                    message: 'Notice period cannot be negative',
                                },
                            }}
                            render={({ field }) => (
                                <>
                                    {isFormReadonly ? (
                                        <TextInput
                                            label="Notice Period"
                                            size="xs"
                                            value={getNoticePeriodLabel(
                                                field.value,
                                            )}
                                            readOnly
                                        />
                                    ) : (
                                        <Select
                                            label="Notice Period"
                                            size="xs"
                                            data={noticePeriodOptions}
                                            value={field.value?.toString()}
                                            onChange={(value) =>
                                                field.onChange(
                                                    Number.parseInt(
                                                        value || '0',
                                                    ),
                                                )
                                            }
                                            error={errors.noticePeriod?.message}
                                        />
                                    )}
                                </>
                            )}
                        />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, md: 2 }}>
                        <Stack gap="sm">
                            <Text size="xs" fw={500}>
                                Willing to Relocate?
                                {!isFormReadonly && (
                                    <Text component="span" c="red">
                                        {' '}
                                        *
                                    </Text>
                                )}
                            </Text>
                            <Controller
                                name="relocationOption"
                                control={control}
                                rules={{
                                    required: isFormReadonly
                                        ? false
                                        : 'Please select a relocation option',
                                }}
                                render={({ field }) => (
                                    <>
                                        {isFormReadonly ? (
                                            <TextInput
                                                size="xs"
                                                value={getRelocationLabel(
                                                    field.value,
                                                )}
                                                readOnly
                                            />
                                        ) : (
                                            <Radio.Group
                                                value={field.value}
                                                onChange={field.onChange}
                                                size="xs"
                                            >
                                                <Stack gap="xs">
                                                    <Radio
                                                        value="YES"
                                                        label="Yes"
                                                    />
                                                    <Radio
                                                        value="NO"
                                                        label="No"
                                                    />
                                                    <Radio
                                                        value="NA"
                                                        label="Maybe, depending on location"
                                                    />
                                                </Stack>
                                            </Radio.Group>
                                        )}
                                    </>
                                )}
                            />
                            {errors.relocationOption && !isFormReadonly && (
                                <Text size="xs" c="red">
                                    {errors.relocationOption.message}
                                </Text>
                            )}
                        </Stack>
                        <Controller
                            name="salaryExpectation"
                            control={control}
                            render={({ field }) => (
                                <>
                                    {isFormReadonly ? (
                                        <TextInput
                                            label="Salary Expectation"
                                            size="xs"
                                            value={formatSalary(field.value)}
                                            readOnly
                                        />
                                    ) : (
                                        <NumberInput
                                            label="Salary Expectation (Optional)"
                                            size="xs"
                                            value={field.value || undefined}
                                            onChange={(value) =>
                                                field.onChange(
                                                    value
                                                        ? Number(value)
                                                        : null,
                                                )
                                            }
                                            min={1000}
                                            max={1000000}
                                            step={1000}
                                            thousandSeparator=","
                                            prefix="$"
                                            placeholder="Enter expected salary (optional)"
                                        />
                                    )}
                                </>
                            )}
                        />
                    </SimpleGrid>
                    <Group justify="space-between">
                        <Text size="xs" c="dimmed">
                            Salary range for this position: $120,000 - $150,000
                        </Text>
                        {!isFormReadonly && watch('salaryExpectation') && (
                            <Text size="xs" c="blue">
                                Your expectation:{' '}
                                {formatSalary(watch('salaryExpectation'))}
                            </Text>
                        )}
                    </Group>
                </Stack>

                {/* Rest of the component remains the same */}
                {/* Documents */}
                <Stack gap="sm">
                    <Group justify="space-between">
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
                                <Group justify="space-between">
                                    <Group
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            if (cv) {
                                                handleViewResume(cv);
                                            }
                                        }}
                                    >
                                        <IconFileText size={16} color="gray" />
                                        <Stack gap={0}>
                                            <Text size="xs">{file.name}</Text>
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
                    </Stack>
                </Stack>

                {/* Cover Letter */}
                <Stack gap="sm">
                    <Group justify="space-between">
                        <Title visibleFrom="md" order={4} hiddenFrom="md">
                            Cover Letter
                            {!isFormReadonly && (
                                <Text component="span" c="red">
                                    {' '}
                                    *
                                </Text>
                            )}
                        </Title>
                    </Group>
                    <Controller
                        name="coverLetter"
                        control={control}
                        rules={{
                            required: isFormReadonly
                                ? false
                                : 'Cover letter is required',
                            minLength: {
                                value: 10,
                                message:
                                    'Cover letter must be at least 10 characters',
                            },
                            maxLength: {
                                value: 1000,
                                message:
                                    'Cover letter must not exceed 1000 characters',
                            },
                        }}
                        render={({ field }) => (
                            <Textarea
                                placeholder={
                                    isFormReadonly
                                        ? ''
                                        : "Tell us why you're interested in this position and what makes you a great fit..."
                                }
                                minRows={6}
                                size="xs"
                                value={field.value}
                                onChange={
                                    isFormReadonly ? undefined : field.onChange
                                }
                                error={
                                    isFormReadonly
                                        ? undefined
                                        : errors.coverLetter?.message
                                }
                                readOnly={isFormReadonly}
                            />
                        )}
                    />
                    <Group justify="space-between">
                        <Text size="xs" c="dimmed">
                            {isFormReadonly
                                ? 'Your submitted cover letter'
                                : 'Adding a personalized cover letter increases your chance of getting an interview by 40%.'}
                        </Text>
                        {!isFormReadonly && (
                            <Text size="xs" c="dimmed">
                                {watch('coverLetter')?.length || 0}/1000
                            </Text>
                        )}
                    </Group>
                </Stack>

                {/* Application Status Messages */}
                {!(canApply?.canApply || isApplicationSubmitted) && (
                    <Blockquote color="red">
                        <Text size="xs" c="dimmed">
                            You haven&apos;t completed your profile, so you
                            won&apos;t be able to apply for this job.
                        </Text>
                    </Blockquote>
                )}

                {isApplicationSubmitted && (
                    <Blockquote color="green">
                        <Text size="xs" c="dimmed">
                            You have successfully applied for this position.
                            Your application is under review.
                        </Text>
                    </Blockquote>
                )}

                {/* Submit Button */}
                <Group grow>
                    {!isApplicationSubmitted && canApply?.canApply && (
                        <Flex justify="end">
                            <Button
                                w="50%"
                                type="submit"
                                size="xs"
                                loading={
                                    applyMutation.isPending ||
                                    isLoading ||
                                    isSubmitting
                                }
                                disabled={
                                    applyMutation.isPending || isSubmitting
                                }
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

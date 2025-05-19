'use client';

import { Link, useRouter } from '@/i18n/routing';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Container, Group, Stepper, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconArrowLeft,
    IconArrowRight,
    IconCheck,
    IconCircleX,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEnum } from 'app/[locale]/_api/enum';
import {
    fetchCategories,
    fetchCities,
    fetchCountries,
    fetchRegionsByCountryId,
    fetchSkills,
} from 'app/[locale]/_api/job-details';
import {
    createMentorship,
    saveMentorshipDraft,
} from 'app/[locale]/_api/mentors/create-mentorships';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { ApplicationDetails } from './components/ApplicationDetails';
import { JobDetails } from './components/JobDetails';
import { JobPreview } from './components/JobPreview';
import { JobRequirements } from './components/JobRequirements';
import { jobSchema } from './components/shcema/job-schema';

export default function PostJobPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [active, setActive] = useState(0);
    // Infer the type from the schema to ensure compatibility
    type JobFormType = z.infer<typeof jobSchema>;

    const methods = useForm<JobFormType>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            isPublished: false,
        },
        mode: 'onChange',
        reValidateMode: 'onChange', // Revalidate on every change
    });

    const { watch, trigger, control, formState } = methods;
    const { errors } = formState;

    // Define fields for each step to check for errors
    const stepFields = {
        0: [
            'title',
            'type',
            'workPlace',
            'deadline',
            'countryId',
            'stateId',
            'cityId',
            'commitment',
            'duration',
            'audience',
            'numberOfApplicants',
        ],
        1: [
            'catagories',
            'skills',
            'experianceLevel',
            'experiance',
            'educationalRequirment',
        ],
        2: ['description', 'contactEmail', 'applicationUrl'],
    };

    // Check if a step has errors
    const hasStepErrors = (stepIndex: number) => {
        const fields = stepFields[stepIndex as keyof typeof stepFields];
        return fields.some((field) => errors[field as keyof typeof errors]);
    };

    // Fetch initial data using TanStack Query
    const { data: countries = [] } = useQuery({
        queryKey: ['countries'],
        queryFn: fetchCountries,
    });

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const { data: skills = [] } = useQuery({
        queryKey: ['skills'],
        queryFn: fetchSkills,
    });

    // Fetch enums
    const { data: employmentTypes = { data: {} } } = useQuery({
        queryKey: ['employmentTypes'],
        queryFn: () => fetchEnum('EmploymentType'),
    });

    const { data: workPlaceTypes = { data: {} } } = useQuery({
        queryKey: ['workPlaceTypes'],
        queryFn: () => fetchEnum('WorkPlaceType'),
    });

    const { data: educationalRequirmentType = { data: {} } } = useQuery({
        queryKey: ['educationalRequirmentType'],
        queryFn: () => fetchEnum('EducationalRequirmentType'),
    });

    // Fetch regions based on selected country
    const selectedCountry = watch('countryId');
    const { data: regions = [] } = useQuery({
        queryKey: ['regions', selectedCountry],
        queryFn: () => {
            if (!selectedCountry) {
                return Promise.resolve([]);
            }
            return fetchRegionsByCountryId(selectedCountry);
        },
        enabled: !!selectedCountry,
    });

    // Fetch cities based on selected state
    const selectedState = watch('stateId');
    const { data: cities = [] } = useQuery({
        queryKey: ['cities', selectedState],
        queryFn: () => {
            if (!selectedState) {
                return Promise.resolve([]);
            }
            return fetchCities(selectedState);
        },
        enabled: !!selectedState,
    });

    const jobMutation = useMutation({
        mutationFn: createMentorship,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            router.push('/mentor/mentorship');
            notifications.show({
                title: 'Success',
                message: 'Job posted successfully',
                color: 'green',
                icon: <IconCheck size="1.1rem" />,
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to post job',
                color: 'red',
            });
        },
    });

    const draftMutation = useMutation({
        mutationFn: saveMentorshipDraft,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobDrafts'] });
            notifications.show({
                title: 'Success',
                message: 'Draft saved successfully',
                color: 'green',
                icon: <IconCheck size="1.1rem" />,
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to save draft',
                color: 'red',
            });
        },
    });

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const onSubmit = (data: any) => {
        const organizationId = getCookie('organization_id')?.toString();
        if (!organizationId) {
            notifications.show({
                title: 'Error',
                message: 'Organization ID is required',
                color: 'red',
            });
            return;
        }

        // Ensure mentorshipType is always a string
        jobMutation.mutate({
            ...data,
            mentorshipType: data.mentorshipType ?? '',
            isPublished: true,
        });
    };

    const onSaveDraft = () => {
        const organizationId = getCookie('organization_id')?.toString();

        if (!organizationId) {
            notifications.show({
                title: 'Error',
                message: 'Organization ID is required',
                color: 'red',
            });
            return;
        }

        if (watch('title') === '') {
            notifications.show({
                title: 'Error',
                message: 'Job title is required',
                color: 'red',
            });
            return;
        }
        const formData = { ...watch() };
        draftMutation.mutate({
            ...formData,
            mentorshipType: formData.mentorshipType ?? '',
            isPublished: false,
        });
    };

    const nextStep = async () => {
        // If moving from the third step to the preview step, validate all fields
        if (active === 2) {
            const isValid = await trigger();

            if (!isValid) {
                return; // Don't proceed if validation fails
            }
        }

        // Otherwise, just move to the next step without validation
        setActive((current) => (current < 3 ? current + 1 : current));
    };

    const prevStep = () =>
        setActive((current) => (current > 0 ? current - 1 : current));

    return (
        <FormProvider {...methods}>
            <Container
                size={'xl'}
                bg={'white'}
                p={'md'}
                className="shadow rounded"
            >
                <Group justify="space-between" align="center" py={'lg'}>
                    <Group>
                        <Link href="/work-provider/jobs" passHref>
                            <Button
                                variant="subtle"
                                leftSection={<IconArrowLeft size={16} />}
                                component="a"
                                color="gray"
                            />
                        </Link>
                        <Title order={2}>Post a New Mentorship</Title>
                    </Group>
                </Group>

                <Stepper
                    active={active}
                    onStepClick={setActive}
                    styles={{
                        stepLabel: {
                            marginTop: 10,
                        },
                        step: {
                            '&[data-error]': {
                                color: 'var(--mantine-color-red-6)',
                            },
                        },
                        stepIcon: {
                            '&[data-error]': {
                                backgroundColor: 'var(--mantine-color-red-6)',
                                borderColor: 'var(--mantine-color-red-6)',
                            },
                        },
                    }}
                >
                    <Stepper.Step
                        label="Job Details"
                        description="Basic job information and salary"
                        completedIcon={
                            hasStepErrors(0) ? (
                                <IconCircleX size="1.1rem" color="white" />
                            ) : undefined
                        }
                        color={hasStepErrors(0) ? 'red' : ''}
                        data-error={hasStepErrors(0)}
                        allowStepSelect={true}
                    >
                        <JobDetails
                            employmentTypes={employmentTypes}
                            workPlaceTypes={workPlaceTypes}
                            countries={countries}
                            regions={regions}
                            cities={cities}
                        />
                    </Stepper.Step>

                    <Stepper.Step
                        label="Requirements"
                        description="Job requirements"
                        completedIcon={
                            hasStepErrors(0) ? (
                                <IconCircleX size="1.1rem" color="white" />
                            ) : undefined
                        }
                        color={hasStepErrors(0) ? 'red' : ''}
                        data-error={hasStepErrors(1)}
                        allowStepSelect={true}
                    >
                        <JobRequirements
                            categories={categories}
                            skills={skills}
                            educationalRequirmentTypes={
                                educationalRequirmentType
                            }
                        />
                    </Stepper.Step>

                    <Stepper.Step
                        label="Application"
                        description="Application details"
                        completedIcon={
                            hasStepErrors(0) ? (
                                <IconCircleX size="1.1rem" color="white" />
                            ) : undefined
                        }
                        color={hasStepErrors(0) ? 'red' : ''}
                        data-error={hasStepErrors(2)}
                        allowStepSelect={true}
                        onClick={nextStep}
                    >
                        <ApplicationDetails
                            control={control}
                            errors={formState.errors}
                        />
                    </Stepper.Step>

                    <Stepper.Step
                        label="Preview"
                        description="Review job posting"
                    >
                        <JobPreview formData={methods.getValues()} />
                    </Stepper.Step>
                </Stepper>

                <Group justify="space-between" mt="xl">
                    <Button
                        variant="default"
                        onClick={prevStep}
                        leftSection={<IconArrowLeft size="1.1rem" />}
                        disabled={active === 0}
                    >
                        Back
                    </Button>

                    <Group>
                        <Button
                            variant="outline"
                            onClick={onSaveDraft}
                            disabled={draftMutation.isPending}
                        >
                            Save as Draft
                        </Button>

                        {active < 3 ? (
                            <Button
                                onClick={nextStep}
                                rightSection={<IconArrowRight size="1.1rem" />}
                            >
                                Next step
                            </Button>
                        ) : (
                            <Button
                                onClick={methods.handleSubmit(onSubmit)}
                                loading={jobMutation.isPending}
                            >
                                Post Job
                            </Button>
                        )}
                    </Group>
                </Group>
            </Container>
        </FormProvider>
    );
}

'use client';

import useIsAuthorized from '@/hooks/useIsAuthorized';
import { useRouter } from '@/i18n/routing';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Container, Group, Paper, Stepper, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEnum } from 'app/[locale]/_api/enum';
import {
    fetchCategories,
    fetchCities,
    fetchCountries,
    fetchRegions,
    fetchSkills,
} from 'app/[locale]/_api/job-details';
import {
    createJob,
    saveJobDraft,
} from 'app/[locale]/_api/organizations/create-jobs';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ApplicationDetails } from './components/ApplicationDetails';
import { JobDetails } from './components/JobDetails';
import { JobRequirements } from './components/JobRequirements';
import { SalaryAndCompensation } from './components/SalaryAndCompensation';
import { jobSchema } from './components/shcema/job-schema';
import type { JobFormData } from './components/types';

export default function PostJobPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user } = useIsAuthorized({
        resourceRole: 'work_provider',
        userRole: 'work_provider',
    });

    const [active, setActive] = useState(0);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const methods = useForm<JobFormData>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            isPublished: false,
        },
        mode: 'onChange',
        reValidateMode: 'onChange', // Revalidate on every change
    });

    const { watch, trigger, control, formState } = methods;

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

    const { data: salaryFrequencyTypes = { data: {} } } = useQuery({
        queryKey: ['salaryFrequencyTypes'],
        queryFn: () => fetchEnum('SalaryFrequencyType'),
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
            return fetchRegions(selectedCountry);
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
        mutationFn: createJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            router.push('work-provider/jobs');
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
        mutationFn: saveJobDraft,
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

    const onSubmit = (data: JobFormData) => {
        const organizationId = getCookie('organization_id')?.toString();
        if (!organizationId) {
            notifications.show({
                title: 'Error',
                message: 'Organization ID is required',
                color: 'red',
            });
            return;
        }

        jobMutation.mutate({
            ...data,
            organizationId: organizationId ?? '',
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

        draftMutation.mutate({
            ...watch(),
            organizationId: organizationId ?? '',
        });
    };

    const nextStep = async () => {
        const fieldsToValidate = {
            0: [
                'title',
                'type',
                'workPlaceType',
                'deadline',
                'countryId',
                'stateId',
                'cityId',
            ],
            1: ['currency', 'salaryFrom', 'salaryTo', 'salaryFrequency'],
            2: [
                'catagories',
                'skills',
                'experianceLevel',
                'experiance',
                'educationalRequirment',
            ],
            3: ['description', 'contactEmail', 'applicationUrl'],
        }[active] as (keyof JobFormData)[];

        const isValid = await trigger(fieldsToValidate);

        // Manually check salary values
        if (active === 1) {
            const salaryFrom = methods.getValues('salaryFrom');
            const salaryTo = methods.getValues('salaryTo');
            if (salaryTo <= salaryFrom) {
                methods.setError('salaryTo', {
                    type: 'manual',
                    message: 'Salary to must be greater than salary from',
                });
                return;
            }
        }

        if (isValid) {
            setActive((current) => (current < 4 ? current + 1 : current));
        }
    };

    const prevStep = () =>
        setActive((current) => (current > 0 ? current - 1 : current));

    const steps = [
        { label: 'Job Details', description: 'Basic job information' },
        { label: 'Salary', description: 'Salary and compensation' },
        { label: 'Requirements', description: 'Job requirements' },
        { label: 'Application', description: 'Application details' },
        { label: 'Preview', description: 'Review job posting' },
    ];

    if (formSubmitted) {
        return (
            <Container size="xl">
                <Paper shadow="sm" p="xl" radius="md">
                    <div className="text-center">
                        <IconCheck
                            size={48}
                            className="text-green-500 mx-auto mb-4"
                        />
                        <Title order={2} mb="md">
                            Job Posted Successfully!
                        </Title>
                        <Button
                            onClick={() => router.push('/work-provider/jobs')}
                            leftSection={<IconArrowLeft size="1.1rem" />}
                        >
                            Back to Jobs
                        </Button>
                    </div>
                </Paper>
            </Container>
        );
    }

    return (
        <FormProvider {...methods}>
            <Container
                fluid
                size="xl"
                bg={'white'}
                p={'md'}
                className="shadow rounded"
            >
                <Title order={2} mb="xl">
                    Post a New Job
                </Title>

                <Stepper
                    active={active}
                    onStepClick={setActive}
                    styles={{
                        stepLabel: {
                            marginTop: 10,
                        },
                    }}
                >
                    <Stepper.Step
                        label="Job Details"
                        description="Basic job information"
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
                        label="Salary"
                        description="Salary and compensation"
                    >
                        <SalaryAndCompensation
                            salaryFrequencyTypes={salaryFrequencyTypes}
                        />
                    </Stepper.Step>

                    <Stepper.Step
                        label="Requirements"
                        description="Job requirements"
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
                    >
                        <ApplicationDetails
                            control={control}
                            errors={formState.errors}
                        />
                    </Stepper.Step>

                    {/* <Stepper.Step label="Preview" description="Review job posting">
            <JobPreview formData={methods.getValues()} />
          </Stepper.Step> */}
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

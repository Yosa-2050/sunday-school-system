'use client';

import type { Experience } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Button,
    Divider,
    Flex,
    Loader,
    LoadingOverlay,
    Select,
    Stack,
    Switch,
    Text,
    TextInput,
    Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useMediaQuery } from '@mantine/hooks';
import { logger } from '@shega/shared';
import {
    useCities,
    useCountries,
    useEmploymentTypes,
    useRegions,
    useWorkplaceTypes,
} from 'app/_api/profile/location';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    type ExperienceFormValues,
    experienceSchema,
} from './experience-schema';

interface ExperienceFormProps {
    experience?: Experience | null;
    onSubmit: (experience: Experience) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export default function ExperienceForm({
    experience,
    onSubmit,
    onCancel,
    isLoading = false,
}: ExperienceFormProps) {
    const isMobile = useMediaQuery('(max-width: 768px)');

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isDirty },
    } = useForm<ExperienceFormValues>({
        resolver: zodResolver(experienceSchema),
        defaultValues: {
            title: experience?.title || '',
            company: experience?.company || '',
            startDate: experience?.startDate || new Date().toISOString(),
            endDate: experience?.endDate || '',
            type: experience?.type || 'full-time',
            countryId: experience?.countryId || '',
            stateId: experience?.stateId || '',
            cityId: experience?.cityId || '',
            workPlace: experience?.workPlace || '',
            description: experience?.description || '',
            currentlyWorking:
                experience?.currentlyWorking ?? !experience?.endDate,
        },
    });

    const isCurrentlyWorking = watch('currentlyWorking');
    const selectedCountryId = watch('countryId');
    const selectedStateId = watch('stateId');

    const { data: countries = [], isLoading: isLoadingCountries } =
        useCountries();
    const selectedCountry = countries.find((c) => c.id === selectedCountryId);
    const { data: regions = [], isLoading: isLoadingRegions } = useRegions(
        selectedCountry?.code || '',
    );
    const { data: cities = [], isLoading: isLoadingCities } = useCities(
        selectedStateId || '',
    );
    const { data: workplaceTypes = [], isLoading: isLoadingWorkplaceTypes } =
        useWorkplaceTypes();
    const { data: employmentTypes = [], isLoading: isLoadingEmploymentTypes } =
        useEmploymentTypes();

    useEffect(() => {
        if (isCurrentlyWorking) {
            setValue('endDate', '');
        }
    }, [isCurrentlyWorking, setValue]);

    useEffect(() => {
        if (selectedCountryId !== experience?.countryId) {
            setValue('stateId', '');
            setValue('cityId', '');
        }
    }, [selectedCountryId, experience?.countryId, setValue]);

    useEffect(() => {
        if (selectedStateId !== experience?.stateId) {
            setValue('cityId', '');
        }
    }, [selectedStateId, experience?.stateId, setValue]);

    const onFormSubmit = (data: ExperienceFormValues) => {
        try {
            const id = experience?.id ?? crypto.randomUUID();
            const experienceData: Experience = {
                id,
                ...data,
                endDate: data.endDate || null,
            };
            onSubmit(experienceData);
        } catch (error) {
            logger.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)}>
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
            />

            <Stack gap="md">
                <Text fw={500} size="sm">
                    Basic Information
                </Text>

                <Flex
                    direction={isMobile ? 'column' : 'row'}
                    gap="md"
                    wrap="wrap"
                >
                    <TextInput
                        label="Job Title"
                        placeholder="e.g. Senior Software Engineer"
                        required
                        error={errors.title?.message}
                        {...register('title')}
                        style={{ flex: 1 }}
                    />
                    <TextInput
                        label="Company"
                        placeholder="e.g. Tech Corp Inc."
                        required
                        error={errors.company?.message}
                        {...register('company')}
                        style={{ flex: 1 }}
                    />
                </Flex>

                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Employment Type"
                            placeholder={
                                isLoadingEmploymentTypes
                                    ? 'Loading...'
                                    : 'Select employment type'
                            }
                            rightSection={
                                isLoadingEmploymentTypes ? (
                                    <Loader size="xs" />
                                ) : null
                            }
                            withAsterisk
                            data={employmentTypes.map((type) => ({
                                value: type.value,
                                label: type.key,
                            }))}
                            error={errors.type?.message}
                            {...field}
                        />
                    )}
                />

                <Divider my="xs" />

                <Flex
                    direction={isMobile ? 'column' : 'row'}
                    gap="md"
                    wrap="wrap"
                >
                    <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                            <DateInput
                                label="Start Date"
                                placeholder="Select start date"
                                required
                                valueFormat="MMMM YYYY"
                                error={errors.startDate?.message}
                                value={
                                    field.value ? new Date(field.value) : null
                                }
                                onChange={(date) =>
                                    field.onChange(date?.toISOString() || '')
                                }
                                maxDate={new Date()}
                                style={{ flex: 1 }}
                            />
                        )}
                    />
                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                            <DateInput
                                label="End Date"
                                placeholder="Select end date"
                                valueFormat="MMMM YYYY"
                                disabled={isCurrentlyWorking}
                                error={errors.endDate?.message}
                                value={
                                    field.value ? new Date(field.value) : null
                                }
                                onChange={(date) =>
                                    field.onChange(date?.toISOString() || '')
                                }
                                minDate={
                                    watch('startDate')
                                        ? new Date(watch('startDate'))
                                        : undefined
                                }
                                maxDate={new Date()}
                                style={{ flex: 1 }}
                            />
                        )}
                    />
                </Flex>

                <Controller
                    name="currentlyWorking"
                    control={control}
                    render={({ field }) => (
                        <Switch
                            label="I currently work here"
                            checked={field.value}
                            onChange={(e) =>
                                field.onChange(e.currentTarget.checked)
                            }
                        />
                    )}
                />

                <Divider my="xs" />

                <Flex
                    direction={isMobile ? 'column' : 'row'}
                    gap="md"
                    wrap="wrap"
                >
                    <Controller
                        name="countryId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Country"
                                placeholder={
                                    isLoadingCountries
                                        ? 'Loading...'
                                        : 'Select country'
                                }
                                rightSection={
                                    isLoadingCountries ? (
                                        <Loader size="xs" />
                                    ) : null
                                }
                                data={countries.map((c) => ({
                                    value: c.id,
                                    label: c.name,
                                }))}
                                error={errors.countryId?.message}
                                required
                                searchable
                                {...field}
                                style={{ flex: 1 }}
                            />
                        )}
                    />
                    <Controller
                        name="stateId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="State/Region"
                                placeholder={
                                    isLoadingRegions
                                        ? 'Loading...'
                                        : 'Select state/region'
                                }
                                rightSection={
                                    isLoadingRegions ? (
                                        <Loader size="xs" />
                                    ) : null
                                }
                                data={regions.map((r) => ({
                                    value: r.id,
                                    label: r.name,
                                }))}
                                error={errors.stateId?.message}
                                required
                                disabled={!selectedCountryId}
                                searchable
                                {...field}
                                style={{ flex: 1 }}
                            />
                        )}
                    />
                </Flex>

                <Flex
                    direction={isMobile ? 'column' : 'row'}
                    gap="md"
                    wrap="wrap"
                >
                    <Controller
                        name="cityId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="City"
                                placeholder={
                                    isLoadingCities
                                        ? 'Loading...'
                                        : 'Select city'
                                }
                                rightSection={
                                    isLoadingCities ? (
                                        <Loader size="xs" />
                                    ) : null
                                }
                                data={cities.map((c) => ({
                                    value: c.id,
                                    label: c.name,
                                }))}
                                error={errors.cityId?.message}
                                required
                                disabled={!selectedStateId}
                                searchable
                                {...field}
                                style={{ flex: 1 }}
                            />
                        )}
                    />
                    <Controller
                        name="workPlace"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Workplace Type"
                                placeholder={
                                    isLoadingWorkplaceTypes
                                        ? 'Loading...'
                                        : 'Select workplace type'
                                }
                                rightSection={
                                    isLoadingWorkplaceTypes ? (
                                        <Loader size="xs" />
                                    ) : null
                                }
                                data={workplaceTypes.map((t) => ({
                                    value: t.value,
                                    label: t.key,
                                }))}
                                error={errors.workPlace?.message}
                                required
                                {...field}
                                style={{ flex: 1 }}
                            />
                        )}
                    />
                </Flex>

                <Divider my="xs" />

                <Textarea
                    label="Description"
                    placeholder="Describe your key responsibilities, achievements, and technologies used"
                    minRows={4}
                    autosize
                    maxRows={8}
                    error={errors.description?.message}
                    {...register('description')}
                />

                <Flex justify="flex-end" gap="sm">
                    <Button variant="light" color="gray" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isDirty}
                        loading={isLoading}
                    >
                        {experience ? 'Update Experience' : 'Add Experience'}
                    </Button>
                </Flex>
            </Stack>
        </form>
    );
}

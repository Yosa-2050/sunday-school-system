import {
    Divider,
    Grid,
    LoadingOverlay,
    NumberInput,
    Select,
    Stack,
    TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { useQueries } from '@tanstack/react-query';
import { fetchEnum } from 'app/[locale]/_api/enum';
import { Controller, useFormContext } from 'react-hook-form';
import type { JobFormData } from './types';
import { mapEnumToOptions } from './utils';

interface JobDetailsProps {
    employmentTypes: { data: Record<string, string> };
    workPlaceTypes: { data: Record<string, string> };
    countries: { id: string; name: string; code: string }[];
    regions: { id: string; name: string }[];
    cities: { id: string; name: string }[];
}

export const JobDetails = ({
    employmentTypes,
    workPlaceTypes,
    countries,
    regions,
    cities,
}: JobDetailsProps) => {
    const {
        register,
        watch,
        formState: { errors },
        control,
        setValue,
    } = useFormContext<JobFormData>();

    const icon = <IconCalendar size={18} stroke={1.5} />;

    const [commitment, audience, mentorshipType] = useQueries({
        queries: [
            {
                queryKey: ['commitment'],
                queryFn: () => fetchEnum('CommitmentType'),
                enabled: true,
            },
            {
                queryKey: ['audience'],
                queryFn: () => fetchEnum('ExperianceLevelType'),
                enabled: true,
            },
            {
                queryKey: ['mentorshipType'],
                queryFn: () => fetchEnum('MentorshipType'),
                enabled: true,
            },
        ],
    });

    const selectedCountry = watch('countryId');
    const selectedState = watch('stateId');

    if (
        commitment.isLoading ||
        audience.isLoading ||
        mentorshipType.isLoading
    ) {
        return <LoadingOverlay visible />;
    }

    return (
        <Stack gap="xl">
            <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                        label="Mentorship Title"
                        placeholder="Enter mentorship title"
                        {...register('title')}
                        error={errors.title?.message}
                        required
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="mentorshipType"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Mentorship Type"
                                placeholder="Select mentorship type"
                                data={mapEnumToOptions(
                                    mentorshipType.data?.data ?? {},
                                )}
                                value={
                                    field.value 
                                }
                                onChange={(value) =>
                                    field.onChange(
                                        value
                                           )
                                }
                                error={errors.mentorshipType?.message}
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="workPlace"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Workplace Type"
                                placeholder="Select workplace type"
                                data={mapEnumToOptions(workPlaceTypes.data)}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.workPlace?.message}
                                required
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="deadline"
                        control={control}
                        render={({ field }) => (
                            <DateInput
                                leftSection={
                                    <IconCalendar size={18} stroke={1.5} />
                                }
                                // contentEditable={false}
                                // readOnly
                                label="Application Deadline"
                                placeholder="Select deadline"
                                minDate={new Date()}
                                value={
                                    field.value ? new Date(field.value) : null
                                }
                                onChange={(date) => field.onChange(date)}
                                error={errors.deadline?.message}
                                required
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="countryId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Country"
                                placeholder="Select country"
                                data={countries.map((country) => ({
                                    value: country.id,
                                    label: country.name,
                                }))}
                                searchable
                                value={field.value}
                                onChange={(value) => {
                                    field.onChange(value);
                                    setValue('stateId', '');
                                    setValue('cityId', '');
                                }}
                                error={errors.countryId?.message}
                                required
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="stateId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Region/State"
                                placeholder="Select region/state"
                                data={regions.map((region) => ({
                                    value: region.id,
                                    label: region.name,
                                }))}
                                searchable
                                value={field.value}
                                onChange={(value) => {
                                    field.onChange(value);
                                    setValue('cityId', '');
                                }}
                                error={errors.stateId?.message}
                                required
                                disabled={!selectedCountry}
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="cityId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="City"
                                placeholder="Select city"
                                data={cities.map((city) => ({
                                    value: city.id,
                                    label: city.name,
                                }))}
                                searchable
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.cityId?.message}
                                required
                                disabled={!selectedState}
                            />
                        )}
                    />
                </Grid.Col>
            </Grid>

            <Divider my="md" />
            <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="commitment"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Commitment Type"
                                placeholder="Enter commitment type"
                                data={mapEnumToOptions(
                                    commitment.data?.data ?? {},
                                )}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.commitment?.message}
                                required
                                min={1}
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="duration"
                        control={control}
                        render={({ field }) => (
                            <NumberInput
                                label="Duration (weeks)"
                                placeholder="Enter duration"
                                description="e.g. 2 weeks/month"
                                min={1}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.duration?.message}
                                required
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="audience"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Target Audience"
                                placeholder="Enter Target Audience"
                                data={mapEnumToOptions(
                                    audience.data?.data ?? {},
                                )}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.commitment?.message}
                                required
                                min={1}
                            />
                        )}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="numberOfApplicants"
                        control={control}
                        render={({ field }) => (
                            <NumberInput
                                label="Number of Applicants"
                                placeholder="Enter number of applicants"
                                min={1}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.numberOfApplicants?.message}
                                required
                            />
                        )}
                    />
                </Grid.Col>
            </Grid>
        </Stack>
    );
};

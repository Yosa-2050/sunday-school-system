import {
    Divider,
    Grid,
    NumberInput,
    Select,
    Stack,
    TextInput,
    Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { Controller, useFormContext } from 'react-hook-form';
import type { JobFormData } from './types';
import { mapEnumToOptions } from './utils';

interface JobDetailsProps {
    employmentTypes: { data: Record<string, string> };
    workPlaceTypes: { data: Record<string, string> };
    countries: { id: string; name: string; code: string }[];
    regions: { id: string; name: string }[];
    cities: { id: string; name: string }[];
    salaryFrequencyTypes: { data: Record<string, string> };
    salaryTypes: { data: Record<string, string> };
}

export const JobDetails = ({
    employmentTypes,
    workPlaceTypes,
    countries,
    regions,
    cities,
    salaryFrequencyTypes,
    salaryTypes,
}: JobDetailsProps) => {
    const {
        register,
        watch,
        formState: { errors },
        control,
        setValue,
    } = useFormContext<JobFormData>();

    const icon = <IconCalendar size={18} stroke={1.5} />;

    const selectedCountry = watch('countryId');
    const selectedState = watch('stateId');

    return (
        <Stack gap="xl">
            <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                        label="Job Title"
                        placeholder="Enter job title"
                        {...register('title')}
                        error={errors.title?.message}
                        required
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Employment Type"
                                placeholder="Select employment type"
                                data={mapEnumToOptions(employmentTypes.data)}
                                value={field.value}
                                onChange={(value) =>
                                    field.onChange(
                                        value as
                                            | 'FULL_TIME'
                                            | 'PART_TIME'
                                            | 'Contract'
                                            | 'Internship',
                                    )
                                }
                                error={errors.type?.message}
                                required
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
                                    value: country.code,
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

            <Title order={3}>Salary and Compensation</Title>

            <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Controller
                        name="salaryType"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Salary Type"
                                placeholder="Select Salary Type"
                                data={mapEnumToOptions(salaryTypes.data)}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.currency?.message}
                                required
                            />
                        )}
                    />
                </Grid.Col>
                {(watch('salaryType') === 'FIXED' ||
                    watch('salaryType') === 'RANGE' ||
                    !watch('salaryType')) && (
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Controller
                            name="salaryFrequency"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Salary Frequency"
                                    placeholder="Select salary frequency"
                                    data={mapEnumToOptions(
                                        salaryFrequencyTypes.data,
                                    )}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.salaryFrequency?.message}
                                    required
                                />
                            )}
                        />
                    </Grid.Col>
                )}
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    {(watch('salaryType') === 'FIXED' ||
                        watch('salaryType') === 'RANGE' ||
                        !watch('salaryType')) && (
                        <Controller
                            name="salaryFrom"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    label={
                                        watch('salaryType') === 'FIXED'
                                            ? 'Salary'
                                            : 'Minimum Salary'
                                    }
                                    placeholder={
                                        watch('salaryType') === 'FIXED'
                                            ? 'Enter salary'
                                            : 'Enter minimum salary'
                                    }
                                    min={0}
                                    value={Number(field.value) || undefined}
                                    onChange={(value) =>
                                        field.onChange(Number(value))
                                    }
                                    error={errors.salaryFrom?.message}
                                    required
                                    hideControls
                                />
                            )}
                        />
                    )}
                </Grid.Col>

                {(watch('salaryType') === 'RANGE' || !watch('salaryType')) && (
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Controller
                            name="salaryTo"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    label="Maximum Salary"
                                    placeholder="Enter maximum salary"
                                    min={0}
                                    value={Number(field.value) || undefined}
                                    onChange={(value) =>
                                        field.onChange(Number(value))
                                    }
                                    error={errors.salaryTo?.message}
                                    required
                                    hideControls
                                />
                            )}
                        />
                    </Grid.Col>
                )}

                {(watch('salaryType') === 'FIXED' ||
                    watch('salaryType') === 'RANGE' ||
                    !watch('salaryType')) && (
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Controller
                            name="currency"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Currency"
                                    placeholder="Select currency"
                                    data={[
                                        {
                                            value: 'ETB',
                                            label: 'Ethiopian Birr (ETB)',
                                        },
                                        {
                                            value: 'USD',
                                            label: 'US Dollar (USD)',
                                        },
                                        { value: 'EUR', label: 'Euro (EUR)' },
                                    ]}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.currency?.message}
                                    required
                                />
                            )}
                        />
                    </Grid.Col>
                )}
            </Grid>
        </Stack>
    );
};

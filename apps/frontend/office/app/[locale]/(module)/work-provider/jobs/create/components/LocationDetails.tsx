import { Divider, Grid, Select, Text } from '@mantine/core';
import { type Control, Controller, type FieldErrors } from 'react-hook-form';
import type { JobFormData } from './types';

interface LocationDetailsProps {
    control: Control<JobFormData>;
    errors: FieldErrors<JobFormData>;
    countries?: { id: string; name: string }[];
    regions?: {
        id: string;
        isActive: boolean;
        name: string;
        type: string;
        isRoot: boolean;
        hasChild: boolean;
    }[];
    cities?: { id: string; name: string }[];
    selectedCountry: string | null;
    selectedState: string | null;
    onCountryChange: (value: string | null) => void;
    onStateChange: (value: string | null) => void;
}

export const LocationDetails = ({
    control,
    errors,
    countries,
    regions,
    cities,
    selectedCountry,
    selectedState,
    onCountryChange,
    onStateChange,
}: LocationDetailsProps) => {
    const mapCountriesToOptions = (
        countries: LocationDetailsProps['countries'],
    ) => {
        if (!countries) {
            return [];
        }
        return countries.map((country) => ({
            value: country.id,
            label: country.name,
        }));
    };

    const mapRegionsToOptions = (regions: LocationDetailsProps['regions']) => {
        if (!regions) {
            return [];
        }
        return regions
            .filter((region) => region.isActive)
            .map((region) => ({ value: region.id, label: region.name }));
    };

    const mapCitiesToOptions = (cities: LocationDetailsProps['cities']) => {
        if (!cities) {
            return [];
        }
        return cities.map((city) => ({ value: city.id, label: city.name }));
    };

    return (
        <Grid>
            <Grid.Col span={12} mt="md">
                <Text fw={500} size="lg" mb="xs">
                    Location Details
                </Text>
                <Divider mb="md" />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
                <Controller
                    name="countryId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Country"
                            withAsterisk
                            placeholder="Select country"
                            data={mapCountriesToOptions(countries)}
                            onChange={(value) => {
                                field.onChange(value);
                                onCountryChange(value);
                            }}
                            value={field.value}
                            error={errors.countryId?.message}
                            searchable
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
                            label="State"
                            withAsterisk
                            placeholder={
                                selectedCountry
                                    ? 'Select state'
                                    : 'Please select a country first'
                            }
                            data={mapRegionsToOptions(regions)}
                            onChange={(value) => {
                                field.onChange(value);
                                onStateChange(value);
                            }}
                            value={field.value}
                            error={errors.stateId?.message}
                            disabled={!selectedCountry}
                            searchable
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
                            withAsterisk
                            placeholder={
                                selectedState
                                    ? 'Select city'
                                    : 'Please select a state first'
                            }
                            data={mapCitiesToOptions(cities)}
                            disabled={!selectedState}
                            {...field}
                            error={errors.cityId?.message}
                            searchable
                        />
                    )}
                />
            </Grid.Col>
        </Grid>
    );
};

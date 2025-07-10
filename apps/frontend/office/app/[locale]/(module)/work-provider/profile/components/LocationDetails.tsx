'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    Divider,
    Group,
    Paper,
    Select,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    fetchCities,
    fetchCountries,
    fetchRegionsId,
} from 'app/[locale]/_api/job-details';
import { updateLocation } from 'app/[locale]/_api/organizations/updateOrganization';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

// Schema definition
export const locationSchema = z.object({
    country: z.string().optional(),
    region: z.string().optional(),
    city: z.string().optional(),
    subCity: z.string().optional(),
    woreda: z.string().optional(),
    addressText: z.string().optional(),
});

export type LocationFormData = z.infer<typeof locationSchema>;

type LocationSectionProps = {
    defaultLocation?: Partial<LocationFormData>;
    canUpdateProfile: boolean;
};

const fields: { name: keyof LocationFormData; label: string }[] = [
    { name: 'country', label: 'Country' },
    { name: 'region', label: 'Region' },
    { name: 'city', label: 'City' },
    { name: 'subCity', label: 'Sub City' },
    { name: 'woreda', label: 'Woreda' },
    { name: 'addressText', label: 'Address Description' },
];

export const LocationSection = ({
    defaultLocation,
    canUpdateProfile,
}: LocationSectionProps) => {
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const id = getCookie('organization_id')?.toString();

    const {
        control,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm<LocationFormData>({
        resolver: zodResolver(locationSchema),
        defaultValues: defaultLocation ?? {},
    });

    const selectedCountry = useWatch({ control, name: 'country' });
    const selectedRegion = useWatch({ control, name: 'region' });

    const { data: countries = [] } = useQuery({
        queryKey: ['countries'],
        queryFn: fetchCountries,
    });

    const { data: regions = [] } = useQuery({
        queryKey: ['regions', selectedCountry],
        queryFn: () =>
            selectedCountry
                ? fetchRegionsId(selectedCountry)
                : Promise.resolve([]),
        enabled: !!selectedCountry,
    });

    const { data: cities = [] } = useQuery({
        queryKey: ['cities', selectedRegion],
        queryFn: () =>
            selectedRegion ? fetchCities(selectedRegion) : Promise.resolve([]),
        enabled: !!selectedRegion,
    });

    const mutation = useMutation({
        mutationFn: (data: LocationFormData) => updateLocation(id ?? '', data),
        onSuccess: () => {
            setIsEditingLocation(false);
        },
    });

    const onSubmit = (data: LocationFormData) => mutation.mutate(data);

    return (
        <Paper p="md" mt="xl">
            <Group justify="space-between" align="center" mb="xs">
                <Title order={6}>Location Details</Title>

                {canUpdateProfile && (
                    <Group gap="xs">
                        {isEditingLocation ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        reset();
                                        setIsEditingLocation(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    loading={mutation.isPending}
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="light"
                                leftSection={<IconEdit size={16} />}
                                onClick={() => setIsEditingLocation(true)}
                            >
                                Edit
                            </Button>
                        )}
                    </Group>
                )}
            </Group>

            <Divider mb="md" />

            <Group gap="md" wrap="wrap">
                {fields.map(({ name, label }) => {
                    const isSelect = ['country', 'region', 'city'].includes(
                        name,
                    );
                    const options =
                        name === 'country'
                            ? countries.map((c) => ({
                                  value: c.id,
                                  label: c.name,
                              }))
                            : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                              name === 'region'
                              ? regions.map((r) => ({
                                    value: r.id,
                                    label: r.name,
                                }))
                              : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                name === 'city'
                                ? cities.map((c) => ({
                                      value: c.id,
                                      label: c.name,
                                  }))
                                : [];

                    return (
                        <Box
                            key={name}
                            w={{ base: '100%', sm: '45%', md: '30%' }}
                        >
                            <Text size="xs" c="dimmed" mb={4}>
                                {label}
                            </Text>

                            {isEditingLocation ? (
                                <Controller
                                    name={name}
                                    control={control}
                                    render={({ field }) =>
                                        isSelect ? (
                                            <Select
                                                {...field}
                                                data={options}
                                                placeholder={`Select ${label.toLowerCase()}`}
                                                onChange={(value) =>
                                                    field.onChange(value)
                                                }
                                                value={field.value || null}
                                                error={errors?.[name]?.message}
                                                clearable
                                            />
                                        ) : (
                                            <TextInput
                                                {...field}
                                                placeholder={`Enter ${label.toLowerCase()}`}
                                                error={errors?.[name]?.message}
                                            />
                                        )
                                    }
                                />
                            ) : (
                                <Text fw={400}>{getValues(name) || '-'}</Text>
                            )}
                        </Box>
                    );
                })}
            </Group>
        </Paper>
    );
};

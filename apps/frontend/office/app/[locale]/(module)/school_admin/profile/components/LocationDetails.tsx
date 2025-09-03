'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    Card,
    Divider,
    Flex,
    Group,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    fetchCities,
    fetchCountries,
    fetchRegionsId,
} from 'app/[locale]/_api/job-details';
import {
    getAddressById,
    getCountryById,
} from 'app/[locale]/_api/organizations/get-addresses';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const locationSchema = z.object({
    country: z.string().optional(),
    region: z.string().optional(),
    city: z.string().optional(),
    subCity: z.string().optional(),
    woreda: z.string().optional(),
    addressText: z.string().optional(),
});

export type LocationFormData = z.infer<typeof locationSchema>;

type LocationSectionProps = {
    defaultLocation?: {
        locationData: LocationFormData;
    };
    canUpdateProfile: boolean;
};

export const LocationSection = ({
    defaultLocation,
    canUpdateProfile,
}: LocationSectionProps) => {
    const queryClient = useQueryClient();
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const id = getCookie('organization_id')?.toString();

    const initialValues = defaultLocation?.locationData ?? {};

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LocationFormData>({
        resolver: zodResolver(locationSchema),
        defaultValues: initialValues,
    });

    const selectedCountry = useWatch({ control, name: 'country' });
    const selectedRegion = useWatch({ control, name: 'region' });
    const selectedSubCity = useWatch({ control, name: 'subCity' });
    const selectedWoreda = useWatch({ control, name: 'woreda' });
    const selectedAddressText = useWatch({ control, name: 'addressText' });

    // Fetch names by ID for display mode
    const { data: countryName } = useQuery({
        queryKey: ['country', initialValues.country],
        queryFn: () =>
            initialValues.country
                ? getCountryById(initialValues.country)
                : Promise.resolve(null),
        enabled: !!initialValues.country,
    });

    const { data: stateName } = useQuery({
        queryKey: ['state', initialValues.region],
        queryFn: () =>
            initialValues.region
                ? getAddressById(initialValues.region)
                : Promise.resolve(null),
        enabled: !!initialValues.region,
    });

    const { data: cityName } = useQuery({
        queryKey: ['city', initialValues.city],
        queryFn: () =>
            initialValues.city
                ? getAddressById(initialValues.city)
                : Promise.resolve(null),
        enabled: !!initialValues.city,
    });

    // For edit mode selects
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

    // const mutation = useMutation({
    //     //TODO: fix me
    //     mutationFn: (data: LocationFormData) => updateLocation(id ?? '', data),
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({
    //             queryKey: ['organization_id', id],
    //         });
    //         queryClient.invalidateQueries({
    //             queryKey: ['can_organization_submit'],
    //         });
    //         setIsEditingLocation(false);
    //     },
    // });

    //const onSubmit = (data: LocationFormData) => mutation.mutate(data);

    const fields = [
        {
            name: 'country',
            label: 'Country',
            displayValue: countryName?.name,
            options: countries,
            isSelect: true,
        },
        {
            name: 'region',
            label: 'Region',
            displayValue: stateName?.name,
            options: regions,
            isSelect: true,
        },
        {
            name: 'city',
            label: 'City',
            displayValue: cityName?.name,
            options: cities,
            isSelect: true,
        },
        {
            name: 'subCity',
            label: 'Sub City',
            displayValue: selectedSubCity,
            isSelect: false,
        },
        {
            name: 'woreda',
            label: 'Woreda',
            displayValue: selectedWoreda,
            isSelect: false,
        },
        {
            name: 'addressText',
            label: 'Address Description',
            displayValue: selectedAddressText,
            isSelect: false,
        },
    ];

    return (
        <Paper p="md" mt="xl">
            <Group justify="space-between" align="center" mb="xs" wrap="wrap">
                <Title order={4}>Location Details</Title>

                {canUpdateProfile && (
                    <Group gap="xs" mt={{ base: 'sm', sm: 0 }}>
                        {isEditingLocation ? (
                            <>
                                <Button
                                    variant="outline"
                                    size="xs"
                                    onClick={() => {
                                        reset(initialValues);
                                        setIsEditingLocation(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="xs"
                                    // loading={mutation.isPending}
                                    // onClick={handleSubmit(onSubmit)}
                                >
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="light"
                                size="xs"
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

            {isEditingLocation ? (
                <>
                    {/* Mobile layout: stacked */}
                    <Stack gap="md" hiddenFrom="md">
                        {fields.map(
                            ({ name, label, options = [], isSelect }) => (
                                <Box key={name} w="100%">
                                    <Text size="xs" c="dimmed" mb={4}>
                                        {label}
                                    </Text>
                                    <Controller
                                        name={name as keyof LocationFormData}
                                        control={control}
                                        render={({ field }) =>
                                            isSelect ? (
                                                <Select
                                                    {...field}
                                                    data={options.map((o) => ({
                                                        value: o.id,
                                                        label: o.name,
                                                    }))}
                                                    placeholder={`Select ${label.toLowerCase()}`}
                                                    onChange={(val) =>
                                                        field.onChange(val)
                                                    }
                                                    value={field.value || null}
                                                    error={
                                                        errors?.[
                                                            name as keyof LocationFormData
                                                        ]?.message
                                                    }
                                                    clearable
                                                    searchable
                                                    size="sm"
                                                />
                                            ) : (
                                                <TextInput
                                                    {...field}
                                                    placeholder={`Enter ${label.toLowerCase()}`}
                                                    error={
                                                        errors?.[
                                                            name as keyof LocationFormData
                                                        ]?.message
                                                    }
                                                    size="sm"
                                                />
                                            )
                                        }
                                    />
                                </Box>
                            ),
                        )}
                    </Stack>

                    {/* Desktop layout: horizontal with wrapping */}
                    <Flex gap="md" wrap="wrap" visibleFrom="md">
                        {fields.map(
                            ({ name, label, options = [], isSelect }) => (
                                <Box key={name} w="30%">
                                    <Text size="xs" c="dimmed" mb={4}>
                                        {label}
                                    </Text>
                                    <Controller
                                        name={name as keyof LocationFormData}
                                        control={control}
                                        render={({ field }) =>
                                            isSelect ? (
                                                <Select
                                                    {...field}
                                                    data={options.map((o) => ({
                                                        value: o.id,
                                                        label: o.name,
                                                    }))}
                                                    placeholder={`Select ${label.toLowerCase()}`}
                                                    onChange={(val) =>
                                                        field.onChange(val)
                                                    }
                                                    value={field.value || null}
                                                    error={
                                                        errors?.[
                                                            name as keyof LocationFormData
                                                        ]?.message
                                                    }
                                                    clearable
                                                    searchable
                                                    size="sm"
                                                />
                                            ) : (
                                                <TextInput
                                                    {...field}
                                                    placeholder={`Enter ${label.toLowerCase()}`}
                                                    error={
                                                        errors?.[
                                                            name as keyof LocationFormData
                                                        ]?.message
                                                    }
                                                    size="sm"
                                                />
                                            )
                                        }
                                    />
                                </Box>
                            ),
                        )}
                    </Flex>
                </>
            ) : (
                <>
                    {/* Mobile layout: label above card, stacked */}
                    <Stack gap="sm" hiddenFrom="sm">
                        {fields.map(({ name, label, displayValue }) => (
                            <Box key={name}>
                                <Text size="xs" c="dimmed" mb={4}>
                                    {label}
                                </Text>
                                <Card withBorder padding="sm" radius="md">
                                    <Text fw={500} size="sm">
                                        {displayValue || '-'}
                                    </Text>
                                </Card>
                            </Box>
                        ))}
                    </Stack>

                    {/* Desktop layout: label above card, in columns */}
                    <Group gap="md" wrap="wrap" visibleFrom="sm">
                        {fields.map(({ name, label, displayValue }) => (
                            <Box
                                key={name}
                                style={{ flex: '1 1 30%', minWidth: 200 }}
                            >
                                <Text size="xs" c="dimmed" mb={4}>
                                    {label}
                                </Text>
                                <Card withBorder padding="sm" radius="md">
                                    <Text fw={500} size="sm">
                                        {displayValue || '-'}
                                    </Text>
                                </Card>
                            </Box>
                        ))}
                    </Group>
                </>
            )}
        </Paper>
    );
};

import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    Divider,
    Group,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { updateLocation } from 'app/[locale]/_api/organizations/updateOrganization';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

export const locationSchema = z.object({
    locationData: z.object({
        country: z.string().optional(),
        region: z.string().optional(),
        city: z.string().optional(),
        subcity: z.string().optional(),
        woreda: z.string().optional(),
        houseNumber: z.string().optional(),
    }),
});

export type LocationFormData = z.infer<typeof locationSchema>;

type LocationSectionProps = {
    defaultLocation?: LocationFormData['locationData'];
};

const fields: (keyof LocationFormData['locationData'])[] = [
    'country',
    'region',
    'city',
    'subcity',
    'woreda',
    'houseNumber',
];

export const LocationSection = ({ defaultLocation }: LocationSectionProps) => {
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
        defaultValues: {
            locationData: defaultLocation || {
                country: '',
                region: '',
                city: '',
                subcity: '',
                woreda: '',
                houseNumber: '',
            },
        },
    });

    const mutation = useMutation({
        mutationFn: (data: LocationFormData) => updateLocation(id ?? '', data),
        onSuccess: () => {
            setIsEditingLocation(false);
        },
    });

    const onSubmit = (data: LocationFormData) => mutation.mutate(data);

    return (
        <Box mt="xl">
            <Group justify="space-between" align="center" mb="xs">
                <Title order={6}>Location Details</Title>

                <Button
                    size="xs"
                    variant={isEditingLocation ? 'filled' : 'light'}
                    leftSection={<IconEdit size={14} />}
                    onClick={() => {
                        if (isEditingLocation) {
                            handleSubmit(onSubmit)();
                        } else {
                            setIsEditingLocation(true);
                        }
                    }}
                >
                    {isEditingLocation ? 'Save' : 'Edit'}
                </Button>
            </Group>

            <Divider mb="md" />
            <Group gap="md" wrap="wrap">
                {fields.map((field) => (
                    <Box key={field} w={{ base: '100%', sm: '45%', md: '30%' }}>
                        <Text size="xs" c="dimmed">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </Text>

                        {isEditingLocation ? (
                            <Controller
                                name={`locationData.${field}`}
                                control={control}
                                render={({ field: inputProps }) => (
                                    <TextInput
                                        {...inputProps}
                                        placeholder={`Enter ${field}`}
                                        error={
                                            errors.locationData?.[field]
                                                ?.message
                                        }
                                    />
                                )}
                            />
                        ) : (
                            <Text fw={400}>
                                {getValues(`locationData.${field}`) || '-'}
                            </Text>
                        )}
                    </Box>
                ))}
            </Group>

            {isEditingLocation && (
                <Group justify="flex-end" mt="lg">
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
                </Group>
            )}
        </Box>
    );
};

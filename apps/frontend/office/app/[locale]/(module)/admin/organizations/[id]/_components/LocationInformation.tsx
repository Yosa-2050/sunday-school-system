import {
    Badge,
    Divider,
    Group,
    Loader,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import {
    getAddressById,
    getCountryById,
} from 'app/[locale]/_api/organizations/get-addresses';
import type { Organization } from 'model/Organization';

const LocationInformation = ({
    organizationData,
}: { organizationData: Organization }) => {
    const countryId = organizationData?.locations?.locationData?.country;
    const regionId = organizationData?.locations?.locationData?.region;
    const cityId = organizationData?.locations?.locationData?.city;

    const country = useQuery({
        queryFn: () => getCountryById(countryId ?? ''),
        queryKey: ['country', countryId],
        enabled: !!countryId,
    });

    const state = useQuery({
        queryFn: () => getAddressById(regionId ?? ''),
        queryKey: ['state', regionId],
        enabled: !!regionId,
    });

    const city = useQuery({
        queryFn: () => getAddressById(cityId ?? ''),
        queryKey: ['city', cityId],
        enabled: !!cityId,
    });

    return (
        <Paper shadow="sm" p="lg" radius="md" withBorder h="100%">
            <Group mb="md">
                <ThemeIcon variant="light" radius="xl" size="lg" color="blue">
                    <IconMapPin size={20} />
                </ThemeIcon>
                <Title order={4}>Location Information</Title>
            </Group>

            {organizationData?.locations ? (
                <Stack gap="sm">
                    <Paper
                        key={organizationData?.locations?.id}
                        p="md"
                        radius="md"
                        withBorder
                    >
                        <Group justify="space-between" mb="sm">
                            <Badge
                                color={
                                    organizationData?.locations?.isPreferred
                                        ? 'green'
                                        : 'gray'
                                }
                                variant="filled"
                                size="sm"
                            >
                                {organizationData?.locations?.isPreferred
                                    ? 'Primary'
                                    : 'Secondary'}
                            </Badge>
                        </Group>
                        <Divider mb="sm" />
                        <Stack gap="xs">
                            <Text size="sm">
                                <strong>Country:</strong>{' '}
                                {country.isLoading ? (
                                    <Loader size="xs" />
                                ) : (
                                    country.data?.name || '-'
                                )}
                            </Text>
                            <Text size="sm">
                                <strong>Region:</strong>{' '}
                                {state.isLoading ? (
                                    <Loader size="xs" />
                                ) : (
                                    state.data?.name || '-'
                                )}
                            </Text>
                            <Text size="sm">
                                <strong>City:</strong>{' '}
                                {city.isLoading ? (
                                    <Loader size="xs" />
                                ) : (
                                    city.data?.name || '-'
                                )}
                            </Text>
                            <Text size="sm">
                                <strong>Subcity:</strong>{' '}
                                {organizationData?.locations?.locationData
                                    .subcity ||
                                    organizationData?.locations?.locationData
                                        .subCity ||
                                    '-'}
                            </Text>
                            <Text size="sm">
                                <strong>Woreda:</strong>{' '}
                                {organizationData?.locations?.locationData
                                    .woreda || '-'}
                            </Text>
                        </Stack>
                    </Paper>
                </Stack>
            ) : (
                <Text size="sm" c="dimmed" ta="center" py="md">
                    No location information provided
                </Text>
            )}
        </Paper>
    );
};

export { LocationInformation };

'use client';

import NoData from '@/components/NoData';
import { PageContainer, PageTitle } from '@/components/PageContainer';
import { useRouter } from '@/i18n/routing';
import {
    Button,
    Group,
    LoadingOverlay,
    Modal,
    Paper,
    ScrollArea,
    Table,
    Text,
    TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconChevronRight, IconPin } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    addRegion,
    fetchCities,
    fetchlocationById,
} from 'app/[locale]/_api/job-details';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const CitiesPage = () => {
    const t = useTranslations('locationsPage');
    const queryClient = useQueryClient();
    const router = useRouter();
    const { region } = useParams<{ region: [string, string] }>(); // Get regionId from the URL parameters
    const [regionId, countryId] = region;
    const [newCityName, setNewCityName] = useState('');
    const [modalOpened, setModalOpened] = useState(false);

    //get location by id
    const { data: regionData } = useQuery({
        queryKey: ['region', regionId],
        queryFn: () => fetchlocationById(regionId as string), // Ensure regionId is a string
        enabled: !!regionId,
    });
    const { data: cities = [], isLoading: loadingCities } = useQuery({
        queryKey: ['cities', regionId],
        queryFn: () => fetchCities(regionId as string), // Ensure regionId is a string
        enabled: !!regionId,
    });

    const mutation = useMutation({
        mutationFn: () =>
            addRegion({
                list: [newCityName],
                countryId,
                parentId: regionId,
                type: 'CITY',
            }),
        mutationKey: ['cities'],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cities', regionId] });
            setModalOpened(false);
            setNewCityName('');
            notifications.show({
                title: t('success'),
                message: t('cityAdded'),
                color: 'green',
            });
        },
        onError: () => {
            notifications.show({
                title: t('error'),
                message: t('cityNotAdded'),
                color: 'red',
            });
        },
    });

    const handleAddCity = () => {
        mutation.mutate();
    };

    if (loadingCities) {
        return <LoadingOverlay visible={true} h={'100%'} />;
    }

    return (
        <PageContainer className="flex flex-col gap-2.5">
            <Paper shadow="xs" p="md" style={{ borderRadius: '10px' }}>
                <Group
                    justify="space-between"
                    className="w-full border-b border-gray-200"
                >
                    <PageTitle icon={<IconPin size={28} />}>
                        <Text>
                            {t('regionName')}: {regionData?.name}
                        </Text>
                    </PageTitle>
                    <Button
                        variant="filled"
                        onClick={() => setModalOpened(true)}
                    >
                        {t('addCity')}
                    </Button>
                </Group>
            </Paper>
            <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
                <Modal
                    opened={modalOpened}
                    onClose={() => setModalOpened(false)}
                    title={t('addCity')}
                    centered
                >
                    <TextInput
                        label={t('cityName')}
                        value={newCityName}
                        onChange={(event) =>
                            setNewCityName(event.currentTarget.value)
                        }
                    />
                    <Button
                        onClick={handleAddCity}
                        mt="md"
                        loading={mutation.isPending}
                    >
                        {t('submit')}
                    </Button>
                </Modal>

                {cities.length === 0 ? (
                    <NoData />
                ) : (
                    <>
                        <ScrollArea>
                            <Table
                                striped
                                highlightOnHover
                                withRowBorders
                                withColumnBorders
                            >
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th style={{ textAlign: 'left' }}>
                                            {t('cityName')}
                                        </Table.Th>
                                        <Table.Th style={{ textAlign: 'left' }}>
                                            {t('isActive')}
                                        </Table.Th>
                                        <Table.Th
                                            style={{ textAlign: 'center' }}
                                        >
                                            {t('actions')}
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {cities.map((city) => (
                                        <Table.Tr key={city.id}>
                                            <Table.Td>{city.name}</Table.Td>
                                            <Table.Td>
                                                {city.isActive ? 'Yes' : 'No'}
                                            </Table.Td>
                                            <Table.Td
                                                style={{ textAlign: 'center' }}
                                            >
                                                <Button
                                                    variant="light"
                                                    onClick={() =>
                                                        console.log(
                                                            `Edit ${city.id}`,
                                                        )
                                                    }
                                                >
                                                    <IconChevronRight
                                                        size={16}
                                                    />
                                                </Button>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>
                    </>
                )}
            </Paper>
        </PageContainer>
    );
};

export default CitiesPage;

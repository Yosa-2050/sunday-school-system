'use client';

import NoData from '@/components/NoData';
import { useRouter } from '@/i18n/routing';
import {
    Button,
    Card,
    Divider,
    Flex,
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
import { IconArrowLeft, IconChevronRight } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addRegion, fetchCities } from 'app/[locale]/_api/job-details';
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
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align={'center'} justify={'space-between'}>
                <Group>
                    <IconArrowLeft
                        size={16}
                        onClick={() => router.back()}
                        className="cursor-pointer"
                    />
                    <Text className="font-bold text-xl">{t('title')}</Text>
                </Group>
                <Button variant="filled" onClick={() => setModalOpened(true)}>
                    {t('addCity')}
                </Button>
            </Flex>
            <Divider my="md" />

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
                    <Card mt="md" padding="md" shadow="sm" mb={'md'}>
                        <Text className="font-bold text-lg">
                            {t('selectedRegion')}
                        </Text>
                        <Text>
                            {t('regionName')}: {regionId}
                        </Text>
                    </Card>
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
                                    <Table.Th style={{ textAlign: 'center' }}>
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
                                                <IconChevronRight size={16} />
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
    );
};

export default CitiesPage;

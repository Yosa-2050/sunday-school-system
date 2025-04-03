'use client';

import NoData from '@/components/NoData';
import { useRouter } from '@/i18n/routing';
import {
    Button,
    Card,
    Divider,
    Flex,
    LoadingOverlay,
    Modal,
    Paper,
    ScrollArea,
    Table,
    Text,
    TextInput,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addRegion, fetchCities } from 'app/[locale]/_api/job-details';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const CitiesPage = () => {
    const t = useTranslations('locationsPage');
    const queryClient = useQueryClient();
    const router = useRouter();
    const { regionId } = useParams<{ regionId: string }>(); // Get regionId from the URL parameters
    const [newCityName, setNewCityName] = useState('');
    const [modalOpened, setModalOpened] = useState(false);

    const { data: cities = [], isLoading: loadingCities } = useQuery({
        queryKey: ['cities', regionId],
        queryFn: () => fetchCities(regionId as string), // Ensure regionId is a string
        enabled: !!regionId,
    });

    const mutation = useMutation({
        mutationFn: () => addRegion({ name: newCityName, isActive: true }),
        mutationKey: ['cities'],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cities', regionId] });
            setModalOpened(false);
            setNewCityName('');
        },
    });

    const handleAddCity = () => {
        mutation.mutate({ name: newCityName, isActive: true });
    };

    if (loadingCities) {
        return <LoadingOverlay visible={true} h={'100%'} />;
    }

    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align={'center'} justify={'space-between'}>
                <Text className="font-bold text-xl">{t('title')}</Text>
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
                <Button onClick={handleAddCity} mt="md">
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

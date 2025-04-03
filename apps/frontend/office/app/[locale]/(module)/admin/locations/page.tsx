'use client';

import NoData from '@/components/NoData';
import { useRouter } from '@/i18n/routing';
import {
    Button,
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
import { PER_PAGE, entityParamSchema } from '@shega/shared';
import { EntityPagination, EntitySearch } from '@shega/ui'; // Assuming EntityPagination is imported from the same place as in organizations page
import { IconChevronRight } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    addRegion,
    fetchCities,
    fetchRegions,
} from 'app/[locale]/_api/job-details';
import { useTranslations } from 'next-intl';
import { parseAsJson, useQueryState } from 'nuqs'; // Assuming useQueryState is used for pagination
import { useCallback, useState } from 'react';

const LocationsPage = () => {
    const t = useTranslations('locationsPage');
    const queryClient = useQueryClient();
    const router = useRouter();
    const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
        null,
    );
    const [newRegionName, setNewRegionName] = useState('');
    const [modalOpened, setModalOpened] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entityParams, setEntityParams] = useQueryState(
        'regions',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: PER_PAGE,
            o: [{ f: 'createdAt', d: 'desc' }],
        }),
    ); // Pagination state

    const { data: regions = [], isLoading: loadingRegions } = useQuery({
        queryKey: ['regions', entityParams, searchTerm],
        queryFn: () => fetchRegions('ETH'), // Pass search term to fetchRegions
    });

    const { data: cities = [], isLoading: loadingCities } = useQuery({
        queryKey: ['cities', selectedRegionId],
        queryFn: () => fetchCities(selectedRegionId as string), // Type assertion to ensure selectedRegionId is treated as a string
        enabled: selectedRegionId !== null, // Ensure the query is enabled only if selectedRegionId is not null
    });

    const mutation = useMutation({
        mutationFn: () => addRegion({ name: newRegionName, isActive: true }),
        mutationKey: ['regions'],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['regions', entityParams, searchTerm],
            });
            setModalOpened(false);
            setNewRegionName('');
        },
    });

    const handleAddRegion = () => {
        mutation.mutate();
    };

    const handleSearch = useCallback((searchTerm: string) => {
        setSearchTerm(searchTerm);
    }, []);

    if (loadingRegions) {
        return <LoadingOverlay visible={true} h={'100%'} />;
    }

    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align="center" justify="space-between" className="p-4">
                <Text className="font-bold text-xl">{t('title')}</Text>
                <Button variant="filled" onClick={() => setModalOpened(true)}>
                    {t('addRegion')}
                </Button>
            </Flex>
            <Divider my="md" />

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={t('addRegion')}
                centered
            >
                <TextInput
                    label={t('regionName')}
                    value={newRegionName}
                    onChange={(event) =>
                        setNewRegionName(event.currentTarget.value)
                    }
                />
                <Button onClick={handleAddRegion} mt="md">
                    {t('submit')}
                </Button>
            </Modal>

            {/* Search Control */}
            <Group justify="space-between" className="mb-4">
                <EntitySearch
                    entity="organizations"
                    placeholder={t('searchPlaceholder')}
                    className="!w-[300px]"
                />
            </Group>
            <Divider my="md" />

            {regions.length === 0 ? (
                <NoData />
            ) : (
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
                                    {t('regionName')}
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
                            {regions.map(
                                (region: {
                                    id: string;
                                    name: string;
                                    isActive: boolean;
                                }) => (
                                    <Table.Tr key={region.id}>
                                        <Table.Td>{region.name}</Table.Td>
                                        <Table.Td>
                                            {region.isActive ? 'Yes' : 'No'}
                                        </Table.Td>
                                        <Table.Td
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Button
                                                variant="light"
                                                onClick={() =>
                                                    router.push(
                                                        `locations/${region.id}`,
                                                    )
                                                }
                                            >
                                                <IconChevronRight size={16} />
                                            </Button>
                                        </Table.Td>
                                    </Table.Tr>
                                ),
                            )}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            )}

            <EntityPagination entity="regions" total={regions.length} />
        </Paper>
    );
};

export default LocationsPage;

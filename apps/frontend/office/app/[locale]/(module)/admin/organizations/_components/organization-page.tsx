'use client';
import NoData from '@/components/NoData';
import { PageContainer } from '@/components/PageContainer';
import { Button, Divider, Flex, Group, Paper, Text } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
    PER_PAGE,
    entityParamSchema,
    entityParamSerializer,
    logger,
} from '@shega/shared';
import { EntityFilter, EntityPagination, EntitySearch } from '@shega/ui';
import { IconDownload } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { exportSelectedOrganization } from 'app/[locale]/_api/organizations/export-selected-organizations';
import { fetchOrganizations } from 'app/[locale]/_api/organizations/fetch-organizations';
import {
    activateOrg,
    deactivateOrg,
} from 'app/[locale]/_api/organizations/orgStatus';
import { useTranslations } from 'next-intl';
import { parseAsJson, useQueryState } from 'nuqs';
import { useCallback, useState } from 'react';
import { ActivationModal } from './activation-modal';
import { CreateOrganization } from './create-organization';
import { DeactivationModal } from './deactivation-modal';
import { OrganizationsMobile } from './organizations-mobile';
import { OrganizationsTable } from './organizations-table';

const OrganizationsPage = () => {
    const queryClient = useQueryClient();
    const t = useTranslations('organizationsPage');
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [deactivationOpened, deactivationHandlers] = useDisclosure(false);
    const [activationOpened, activationHandlers] = useDisclosure(false);
    const [reason, setReason] = useState('');
    const [selectedUser, setSelectedUser] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const [selection, setSelection] = useState<string[]>([]);

    const [entityParams] = useQueryState(
        'organizations',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: PER_PAGE,
            o: [{ f: 'createdAt', d: 'desc' }],
        }),
    );

    const { data, isLoading, error } = useQuery({
        queryKey: ['organizations', entityParamSerializer(entityParams)],
        queryFn: () => fetchOrganizations(entityParamSerializer(entityParams)),
    });

    const deactivateUserMutation = useMutation({
        mutationFn: async ({
            userId,
            reason,
        }: {
            userId: string;
            reason: string;
        }) => await deactivateOrg(userId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
            setReason('');
            notifications.show({
                title: 'Deactivation',
                message: 'Organization has been successfully deactivated',
                color: 'green',
            });
        },
        onError: () => {
            notifications.show({
                title: 'Deactivation',
                message:
                    'An error occurred while deactivating the organization',
                color: 'red',
            });
        },
    });

    const activateUserMutation = useMutation({
        mutationFn: async (userId: string) => await activateOrg(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
            notifications.show({
                title: 'Activation',
                message: 'Organization has been successfully activated',
                color: 'green',
            });
        },
        onError: () => {
            notifications.show({
                title: 'Activation',
                message: 'An error occurred while activating the organization',
                color: 'red',
            });
        },
    });

    const exportMutation = useMutation({
        mutationKey: ['exports'],
        mutationFn: exportSelectedOrganization,
        onSuccess: (list) => {
            exportToCsv(list);
        },
        onError: (error) => {
            logger.log(error);
            notifications.show({
                title: 'Export Users',
                message:
                    'Something went wrong while exporting selected Organization',
                color: 'red',
            });
        },
    });

    const exportToCsv = useCallback((list: string[]) => {
        if (!list || list.length === 0) {
            alert('No data available to export');
            return;
        }

        const csvContent = list
            .map((row) =>
                row
                    .split(',')
                    .map((v) => `"${v.replace(/"/g, '""')}"`)
                    .join(','),
            )
            .join('\n');

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'selected_users.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, []);

    const handleExport = () => {
        const payload =
            selection.length === 0
                ? entityParamSerializer({
                      ...entityParams,
                      pp: data?.total,
                  })
                : selection;
        const type: 'filter' | 'selected' =
            selection.length === 0 ? 'filter' : 'selected';
        exportMutation.mutate({ payload, type });
    };

    const handleDeactivate = (user: { id: string; name: string }) => {
        setSelectedUser(user);
        deactivationHandlers.open();
    };

    const handleActivate = (user: { id: string; name: string }) => {
        setSelectedUser(user);
        activationHandlers.open();
    };

    const handleDeactivationConfirm = async () => {
        if (selectedUser) {
            await deactivateUserMutation.mutateAsync({
                userId: selectedUser.id,
                reason,
            });
            deactivationHandlers.close();
            setSelectedUser(null);
        }
    };

    const handleActivationConfirm = async () => {
        if (selectedUser) {
            await activateUserMutation.mutateAsync(selectedUser.id);
            activationHandlers.close();
            setSelectedUser(null);
        }
    };

    const closeDeactivationModal = () => {
        deactivationHandlers.close();
        setSelectedUser(null);
        setReason('');
    };

    const closeActivationModal = () => {
        activationHandlers.close();
        setSelectedUser(null);
    };

    const organizations = data?.data ?? [];

    if (error) {
        return <Text color="red">{t('error')}</Text>;
    }

    return (
        <PageContainer className="flex flex-col gap-2.5">
            {/* Header */}
            <Paper
                p={{ base: 'sm', md: 'md' }}
                style={{ borderRadius: '10px' }}
            >
                <Flex
                    align="center"
                    justify="space-between"
                    className="p-1 md:p-4"
                >
                    <Text className="font-bold text-md md:text-xl">
                        {t('title')}
                    </Text>
                    <CreateOrganization />
                </Flex>
                <Divider my="md" />

                {/* Controls */}
                <Group justify="space-between" className="mb-4">
                    <EntitySearch
                        entity="organizations"
                        placeholder={t('searchPlaceholder')}
                        className="!w-[300px]"
                    />
                    <Flex
                        gap={'xs'}
                        align={'center'}
                        className="flex-col md:flex-row"
                    >
                        <EntityFilter
                            entity="organizations"
                            className="!w-[300px]"
                            filterOptions={[
                                { label: 'All', value: '' },
                                { label: 'Approved', value: 'APPROVED' },
                                {
                                    label: 'Waiting Approval',
                                    value: 'WAITINGAPPROVAL',
                                },
                                { label: 'New', value: 'NEW' },
                                { label: 'Returned', value: 'RETURNED' },
                                { label: 'Declined', value: 'DECLINED' },
                            ]}
                            mode="select"
                            field="status"
                        />
                        <Button
                            variant="light"
                            leftSection={<IconDownload size={18} />}
                            onClick={handleExport}
                            loading={exportMutation.isPending}
                        >
                            {t('exportCSV')}
                        </Button>
                    </Flex>
                </Group>
            </Paper>

            {/* Content */}
            <Paper p="lg" style={{ borderRadius: '10px' }}>
                {organizations.length === 0 && !isLoading ? (
                    <NoData />
                ) : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                isMobile ? (
                    <OrganizationsMobile
                        organizations={organizations}
                        isLoading={isLoading}
                        onActivate={handleActivate}
                        onDeactivate={handleDeactivate}
                        t={t}
                    />
                ) : (
                    <OrganizationsTable
                        organizations={organizations}
                        isLoading={isLoading}
                        selection={selection}
                        setSelection={setSelection}
                        onActivate={handleActivate}
                        onDeactivate={handleDeactivate}
                        t={t}
                    />
                )}

                <EntityPagination
                    entity="organizations"
                    total={data?.total ?? 0}
                />
            </Paper>

            {/* Modals */}
            <DeactivationModal
                opened={deactivationOpened}
                onClose={closeDeactivationModal}
                selectedUser={selectedUser}
                reason={reason}
                setReason={setReason}
                onConfirm={handleDeactivationConfirm}
                isLoading={deactivateUserMutation.isPending}
            />

            <ActivationModal
                opened={activationOpened}
                onClose={closeActivationModal}
                selectedUser={selectedUser}
                onConfirm={handleActivationConfirm}
                isLoading={activateUserMutation.isPending}
            />
        </PageContainer>
    );
};

export default OrganizationsPage;

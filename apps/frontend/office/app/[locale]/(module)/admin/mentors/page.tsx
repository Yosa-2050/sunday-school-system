'use client';

import Can from '@/components/Can';
import NoData from '@/components/NoData';
import {
    Button,
    Card,
    Checkbox,
    Divider,
    Flex,
    Group,
    LoadingOverlay,
    Menu,
    Modal,
    Paper,
    Stack,
    Table,
    TableScrollContainer,
    Text,
    TextInput,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
    PER_PAGE,
    entityParamSchema,
    entityParamSerializer,
} from '@shega/shared';
import { EntityColumn, EntitySearch } from '@shega/ui';
import { IconDotsVertical, IconDownload } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchMentorship } from 'app/[locale]/_api/mentors/fetch-mentorship';
import {
    useActivateMentors,
    useApproveMentors,
    useDeactivateMutation,
    useDeclineMentors,
} from 'app/[locale]/_api/mentors/udpate-mentorship-status';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { parseAsJson, useQueryState } from 'nuqs';
import { useCallback, useState } from 'react';
import { CreateMentors } from './_components/create-mentors';

const MentorshipPage = () => {
    const queryClient = useQueryClient();
    const t = useTranslations('mentorsPage');
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [opened, { open, close }] = useDisclosure(false);
    const [openedActivation, activationHandlers] = useDisclosure(false);

    const [reason, setReason] = useState('');
    const [note, setNote] = useState('');

    const [selectedUser, setSelectedUser] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const [entityParams] = useQueryState(
        'mentors',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: PER_PAGE,
            o: [{ f: 'createdAt', d: 'desc' }],
        }),
    );
    const [selection, setSelection] = useState<string[]>([]);
    const deactivateUserMutation = useDeactivateMutation({
        id: selectedUser?.id || '',
        reason,
    });
    const activateUserMutation = useActivateMentors({
        id: selectedUser?.id || '',
    });
    const approvedMentorsMutation = useApproveMentors({
        id: selectedUser?.id || '',
    });
    const declinedMentorsMutation = useDeclineMentors({
        id: selectedUser?.id || '',
        note,
    });

    // Fetch users using TanStack Query
    const { data, isLoading, error } = useQuery({
        queryKey: ['mentors', entityParamSerializer(entityParams)],
        queryFn: fetchMentorship,
    });

    const exportToCsv = useCallback((list: string[]) => {
        if (!list || list.length === 0) {
            alert('No data available to export');
            return;
        }

        // Convert rows to CSV with proper quoting
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

    // const exportMutation = useMutation({
    //     mutationKey: ['exports'],
    //     mutationFn: exportSelectedOrganization,
    //     onSuccess: (list) => {
    //         exportToCsv(list);
    //     },
    //     onError: (error) => {
    //         logger.log(error);
    //         notifications.show({
    //             title: 'Export Users',
    //             message:
    //                 'Something went wrong while exporting selected Organization',
    //             color: 'red',
    //         });
    //     },
    // });

    if (isLoading) {
        return <LoadingOverlay visible={true} h={'100%'} />;
    }

    if (error) {
        return <Text color="red">{t('error')}</Text>;
    }

    const mentorship = data ?? [];

    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align="center" justify="space-between" className="p-4">
                <Text className="font-bold text-xl">{t('title')}</Text>
                <CreateMentors />
            </Flex>

            <Divider my="md" />

            {/* Search, Filter, Sort Controls */}
            <Group justify="space-between" className="mb-4">
                <EntitySearch
                    entity="mentorship"
                    placeholder={t('searchPlaceholder')}
                    className="!w-[300px]"
                />
                <Flex gap={'xs'} align={'center'}>
                    <Button
                        variant="light"
                        leftSection={<IconDownload size={18} />}
                        // onClick={() => {
                        //     const payload =
                        //         selection.length === 0
                        //             ? entityParamSerializer({
                        //                   ...entityParams,
                        //                   pp: data?.total,
                        //               })
                        //             : selection;
                        //     const type: 'filter' | 'selected' =
                        //         selection.length === 0 ? 'filter' : 'selected';
                        //     exportMutation.mutate({ payload, type });
                        // }}
                        // loading={exportMutation.isPending}
                    >
                        {t('exportCSV')}
                    </Button>
                </Flex>
            </Group>

            {/* No Data State */}
            {mentorship.length === 0 ? (
                <NoData />
            ) : // biome-ignore lint/nursery/noNestedTernary: <explanation>
            isMobile ? (
                <Stack>
                    {mentorship.map((user) => (
                        <Card
                            key={user.createdAt}
                            shadow="sm"
                            p="lg"
                            radius="md"
                            withBorder
                        >
                            <Flex justify="space-between" align="center">
                                <Text
                                    fw={500}
                                >{`${user.profile?.firstName} ${user.profile?.middleName} ${user.profile.lastName}`}</Text>
                            </Flex>
                            <Divider my="xs" />
                            <Text size="xs" c="dimmed">
                                {DateTime.fromISO(
                                    user.createdAt ?? '',
                                ).toFormat('yyyy-MM-dd HH:mm:ss')}
                            </Text>
                            <Group mt="md">
                                <Button variant="light" size="xs">
                                    {t('table.edit')}
                                </Button>
                                <Button variant="light" size="xs" color="red">
                                    {t('table.delete')}
                                </Button>
                            </Group>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <TableScrollContainer minWidth={800} type="native">
                    <Table
                        withRowBorders
                        withColumnBorders
                        striped
                        verticalSpacing="md"
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>
                                    <Checkbox
                                        // onChange={toggleAll}
                                        checked={
                                            selection.length ===
                                            mentorship.length
                                        }
                                        indeterminate={
                                            selection.length > 0 &&
                                            selection.length !==
                                                mentorship.length
                                        }
                                    />
                                </Table.Th>
                                <Table.Th>{t('table.name')}</Table.Th>
                                <Table.Th>
                                    <EntityColumn
                                        entity="mentorship"
                                        field="createdAt"
                                        label={t('table.createdAt')}
                                    />
                                </Table.Th>
                                <Table.Th>{t('table.createdBy')}</Table.Th>
                                <Table.Th>{t('table.status')}</Table.Th>
                                <Table.Th>{t('table.approvalStatus')}</Table.Th>
                                <Can roles={['super_admin']}>
                                    <Table.Th>{t('table.actions')}</Table.Th>
                                </Can>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation> */}
                            {mentorship.map((user) => (
                                <Table.Tr key={user.id}>
                                    <Table.Td>
                                        <Checkbox
                                            checked={selection.includes(
                                                user.id ?? '',
                                            )}
                                            // onChange={() =>
                                            //     toggleRow(user.id ?? '')
                                            // }
                                        />
                                    </Table.Td>
                                    <Table.Td>{`${user.profile?.firstName} ${user.profile?.middleName} ${user.profile.lastName}`}</Table.Td>

                                    {/* <Table.Td>{user.createdBy}</Table.Td> */}
                                    <Table.Td>
                                        {DateTime.fromISO(
                                            user.createdAt ?? '',
                                        ).toFormat('yyyy-MM-dd HH:mm:ss')}
                                    </Table.Td>
                                    <Table.Td>Created By</Table.Td>
                                    <Table.Td
                                        className={
                                            user.status === 'APPROVED'
                                                ? 'text-green-600'
                                                : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                                  user.status === 'New'
                                                  ? 'text-yellow-600'
                                                  : 'text-red-600'
                                        }
                                    >
                                        {user.status === 'APPROVED'
                                            ? t('status.approved')
                                            : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                              user.status === 'New'
                                              ? t('status.new')
                                              : t('status.decline')}
                                    </Table.Td>
                                    <Table.Td>
                                        {user.isActive
                                            ? t('status.active')
                                            : t('status.inactive')}
                                    </Table.Td>
                                    <Can roles={['super_admin']}>
                                        <Table.Td>
                                            <Menu width={200}>
                                                <Menu.Target>
                                                    <IconDotsVertical
                                                        size={18}
                                                        className="cursor-pointer"
                                                    />
                                                </Menu.Target>
                                                <Menu.Dropdown>
                                                    <Menu.Item>
                                                        Detail
                                                    </Menu.Item>

                                                    {user.isActive ? (
                                                        <Menu.Item
                                                            color="red"
                                                            onClick={() => {
                                                                setSelectedUser(
                                                                    {
                                                                        id: user.id,
                                                                        name: user
                                                                            .profile
                                                                            .firstName,
                                                                    },
                                                                );
                                                                open();
                                                            }}
                                                        >
                                                            Deactivate
                                                        </Menu.Item>
                                                    ) : (
                                                        <Menu.Item
                                                            onClick={() => {
                                                                setSelectedUser(
                                                                    {
                                                                        id: user.id,
                                                                        name: user
                                                                            .profile
                                                                            .lastName,
                                                                    },
                                                                );
                                                                activationHandlers.open();
                                                            }}
                                                        >
                                                            Activate
                                                        </Menu.Item>
                                                    )}
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Table.Td>
                                    </Can>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                    <Modal
                        opened={opened}
                        onClose={() => {
                            close();
                            setSelectedUser(null);
                        }}
                        title="Organization Deactivation"
                        centered
                    >
                        <TextInput
                            placeholder="Enter the reason for deactivation"
                            label="Reason"
                            description="Please provide a reason for deactivating this mentorship."
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />

                        <Group mt="xl" justify="flex-end">
                            <Button variant="default" onClick={close}>
                                Cancel
                            </Button>
                            <Button
                                color="red"
                                loading={deactivateUserMutation.isPending}
                                onClick={async () => {
                                    if (selectedUser) {
                                        await deactivateUserMutation.mutateAsync();
                                        close();
                                        setSelectedUser(null);
                                    }
                                }}
                            >
                                Deactivate
                            </Button>
                        </Group>
                    </Modal>
                    <Modal
                        opened={openedActivation}
                        onClose={() => {
                            activationHandlers.close();
                            setSelectedUser(null);
                        }}
                        title="Organization Deactivation"
                        centered
                    >
                        <Text>
                            Are you sure you want to activate{' '}
                            <Text span fw={600}>
                                {selectedUser?.name}{' '}
                            </Text>
                            Organization?
                        </Text>

                        <Group mt="xl" justify="flex-end">
                            <Button
                                variant="default"
                                onClick={() => {
                                    activationHandlers.close();
                                    setSelectedUser(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                loading={activateUserMutation.isPending}
                                onClick={async () => {
                                    if (selectedUser) {
                                        await activateUserMutation.mutateAsync();
                                        activationHandlers.close();
                                        setSelectedUser(null);
                                    }
                                }}
                            >
                                Activate
                            </Button>
                        </Group>
                    </Modal>
                    <Modal
                        opened={openedActivation}
                        onClose={() => {
                            activationHandlers.close();
                            setSelectedUser(null);
                        }}
                        title="Mentors Deactivation"
                        centered
                    >
                        <Text>
                            Are you sure you want to Approve{' '}
                            <Text span fw={600}>
                                {selectedUser?.name}{' '}
                            </Text>
                            Mentors?
                        </Text>

                        <Group mt="xl" justify="flex-end">
                            <Button
                                variant="default"
                                onClick={() => {
                                    activationHandlers.close();
                                    setSelectedUser(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                loading={approvedMentorsMutation.isPending}
                                onClick={async () => {
                                    if (selectedUser) {
                                        await approvedMentorsMutation.mutateAsync();
                                        activationHandlers.close();
                                        setSelectedUser(null);
                                    }
                                }}
                            >
                                Activate
                            </Button>
                        </Group>
                    </Modal>
                    <Modal
                        opened={opened}
                        onClose={() => {
                            close();
                            setSelectedUser(null);
                        }}
                        title="Mentor Deactivation"
                        centered
                    >
                        <TextInput
                            placeholder="Enter the reason for deactivation"
                            label="Reason"
                            description="Please provide a reason for decline this mentor."
                            required
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />

                        <Group mt="xl" justify="flex-end">
                            <Button variant="default" onClick={close}>
                                Cancel
                            </Button>
                            <Button
                                color="red"
                                loading={declinedMentorsMutation.isPending}
                                onClick={async () => {
                                    if (selectedUser) {
                                        await declinedMentorsMutation.mutateAsync();
                                        close();
                                        setSelectedUser(null);
                                    }
                                }}
                            >
                                Deactivate
                            </Button>
                        </Group>
                    </Modal>
                </TableScrollContainer>
            )}

            {/* <EntityPagination entity="mentorship" total={data?.total ?? 0} /> */}
        </Paper>
    );
};

export default MentorshipPage;

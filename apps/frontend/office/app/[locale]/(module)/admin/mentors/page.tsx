// File: MentorshipPage.tsx
'use client';

import {
    Button,
    Card,
    Checkbox,
    Divider,
    Flex,
    Group,
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
import { useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { parseAsJson, useQueryState } from 'nuqs';
import { useState } from 'react';

import Can from '@/components/Can';
import NoData from '@/components/NoData';
import { PageContainer } from '@/components/PageContainer';
import {
    PER_PAGE,
    entityParamSchema,
    entityParamSerializer,
} from '@shega/shared';
import { EntityColumn, EntityPagination, EntitySearch } from '@shega/ui';
import { IconDotsVertical } from '@tabler/icons-react';

import { EntityPageLoading } from '@/components/EntityPageLoading';
import { fetchMentorship } from 'app/[locale]/_api/mentors/fetch-mentorship';
import {
    useActivateMentors,
    useDeactivateMutation,
} from 'app/[locale]/_api/mentors/udpate-mentorship-status';
import { CreateMentors } from './_components/create-mentors';

const HeaderSection = () => {
    const t = useTranslations('mentorsPage');
    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align="center" justify="space-between" className="p-4">
                <Text className="font-bold text-xl">{t('title')}</Text>
                <CreateMentors />
            </Flex>
            <Divider my="md" />
            <Group justify="space-between" className="mb-4">
                <EntitySearch
                    entity="mentorship"
                    placeholder={t('searchPlaceholder')}
                    className="!w-[300px]"
                />
            </Group>
        </Paper>
    );
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const MentorshipCards = ({ data }: { data: any[] }) => {
    const t = useTranslations('mentorsPage');
    return (
        <Stack>
            {data.map((user) => (
                <Card
                    key={user.createdAt}
                    shadow="sm"
                    p="lg"
                    radius="md"
                    withBorder
                >
                    <Flex justify="space-between" align="center">
                        <Text fw={500}>
                            {`${user.profile?.firstName} ${user.profile?.middleName} ${user.profile.lastName}`}
                        </Text>
                    </Flex>
                    <Divider my="xs" />
                    <Text size="xs" c="dimmed">
                        {DateTime.fromISO(user.createdAt ?? '').toFormat(
                            'yyyy-MM-dd HH:mm:ss',
                        )}
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
    );
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const MentorshipTable = ({ data }: { data: any[] }) => {
    const t = useTranslations('mentorsPage');
    const [selection, setSelection] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [reason, setReason] = useState('');
    const [note, setNote] = useState('');
    const [opened, { open, close }] = useDisclosure(false);
    const [openedActivation, activationHandlers] = useDisclosure(false);

    const deactivateUserMutation = useDeactivateMutation({
        id: selectedUser?.id || '',
        reason,
    });
    const activateUserMutation = useActivateMentors({
        id: selectedUser?.id || '',
    });

    return (
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
                                checked={selection.length === data.length}
                                indeterminate={
                                    selection.length > 0 &&
                                    selection.length !== data.length
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
                        <Table.Th>{t('table.approvalStatus')}</Table.Th>
                        <Table.Th>{t('table.status')}</Table.Th>
                        <Can roles={['super_admin']}>
                            <Table.Th>{t('table.actions')}</Table.Th>
                        </Can>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation> */}
                    {data.map((user) => (
                        <Table.Tr key={user.id}>
                            <Table.Td>
                                <Checkbox
                                    checked={selection.includes(user.id ?? '')}
                                />
                            </Table.Td>
                            <Table.Td>{`${user.profile?.firstName} ${user.profile?.middleName} ${user.profile.lastName}`}</Table.Td>
                            <Table.Td>
                                {DateTime.fromISO(
                                    user.createdAt ?? '',
                                ).toFormat('yyyy-MM-dd HH:mm:ss')}
                            </Table.Td>
                            <Table.Td>{user.createdBy}</Table.Td>
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
                                            <Menu.Item>Detail</Menu.Item>
                                            {user.isActive ? (
                                                <Menu.Item
                                                    color="red"
                                                    onClick={() => {
                                                        setSelectedUser({
                                                            id: user.id,
                                                            name: user.profile
                                                                .firstName,
                                                        });
                                                        open();
                                                    }}
                                                >
                                                    Deactivate
                                                </Menu.Item>
                                            ) : (
                                                <Menu.Item
                                                    onClick={() => {
                                                        setSelectedUser({
                                                            id: user.id,
                                                            name: user.profile
                                                                .lastName,
                                                        });
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

            {/* Deactivation Modal */}
            <Modal
                opened={opened}
                onClose={close}
                title="Mentor Deactivation"
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

            {/* Activation Modal */}
            <Modal
                opened={openedActivation}
                onClose={activationHandlers.close}
                title="Mentor Activation"
                centered
            >
                <Text>
                    Are you sure you want to activate{' '}
                    <Text span fw={600}>
                        {selectedUser?.name}
                    </Text>
                    ?
                </Text>
                <Group mt="xl" justify="flex-end">
                    <Button
                        variant="default"
                        onClick={activationHandlers.close}
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
        </TableScrollContainer>
    );
};

const MentorshipPage = () => {
    const t = useTranslations('mentorsPage');
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [entityParams] = useQueryState(
        'mentors',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: PER_PAGE,
            o: [{ f: 'createdAt', d: 'desc' }],
        }),
    );

    const { data, isLoading, error } = useQuery({
        queryKey: ['mentors', entityParamSerializer(entityParams)],
        queryFn: () => fetchMentorship(entityParamSerializer(entityParams)),
    });

    const mentorship = data?.data ?? [];

    return (
        <PageContainer className="flex flex-col gap-2.5">
            <HeaderSection />
            <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
                {isLoading ? (
                    <EntityPageLoading />
                    // biome-ignore lint/nursery/noNestedTernary: <explanation>
                ) : error ? (
                    <Text c="red">{t('error')}</Text>
                    // biome-ignore lint/nursery/noNestedTernary: <explanation>
                ) : mentorship.length === 0 ? (
                    <NoData />
                    // biome-ignore lint/nursery/noNestedTernary: <explanation>
                ) : isMobile ? (
                    <MentorshipCards data={mentorship} />
                ) : (
                    <MentorshipTable data={mentorship} />
                )}
                <EntityPagination entity="mentors" total={data?.total ?? 0} />
            </Paper>
        </PageContainer>
    );
};

export default MentorshipPage;

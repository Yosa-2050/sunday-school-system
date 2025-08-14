'use client';

import Can from '@/components/Can';
import { useRouter } from '@/i18n/routing';
import {
    Checkbox,
    LoadingOverlay,
    Menu,
    Table,
    TableScrollContainer,
} from '@mantine/core';
import { EntityColumn } from '@shega/ui';
import { IconDotsVertical } from '@tabler/icons-react';
import type { Daum } from 'app/[locale]/_api/organizations/fetch-organizations';
import { DateTime } from 'luxon';

interface OrganizationsTableProps {
    organizations: Daum[];
    isLoading: boolean;
    selection: string[];
    setSelection: (
        selection: string[] | ((current: string[]) => string[]),
    ) => void;
    onActivate: (user: { id: string; name: string }) => void;
    onDeactivate: (user: { id: string; name: string }) => void;
    t: (key: string) => string;
}

export const OrganizationsTable = ({
    organizations,
    isLoading,
    selection,
    setSelection,
    onActivate,
    onDeactivate,
    t,
}: OrganizationsTableProps) => {
    const router = useRouter();

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id],
        );

    const toggleAll = () =>
        setSelection((current) =>
            current.length === organizations.length
                ? []
                : organizations.map((user: Daum) => user.id ?? ''),
        );

    const getStatusText = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'Approved';
            case 'DECLINED':
                return 'Declined';
            case 'WAITINGAPPROVAL':
                return 'Waiting for approval';
            case 'RETURNED':
                return 'Returned';
            default:
                return 'New';
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={isLoading} />
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
                                    onChange={toggleAll}
                                    checked={
                                        selection.length ===
                                        organizations.length
                                    }
                                    indeterminate={
                                        selection.length > 0 &&
                                        selection.length !==
                                            organizations.length
                                    }
                                />
                            </Table.Th>
                            <Table.Th>{t('table.name')}</Table.Th>
                            <Table.Th>{t('table.createdBy')}</Table.Th>
                            <Table.Th>
                                <EntityColumn
                                    entity="organizations"
                                    field="createdAt"
                                    label={t('table.createdAt')}
                                />
                            </Table.Th>
                            <Table.Th>{t('table.status')}</Table.Th>
                            <Table.Th>{t('table.approvalStatus')}</Table.Th>
                            <Can roles={['super_admin']}>
                                <Table.Th>{t('table.actions')}</Table.Th>
                            </Can>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {organizations.map((user: Daum) => (
                            <Table.Tr key={user.id}>
                                <Table.Td>
                                    <Checkbox
                                        checked={selection.includes(
                                            user.id ?? '',
                                        )}
                                        onChange={() =>
                                            toggleRow(user.id ?? '')
                                        }
                                    />
                                </Table.Td>
                                <Table.Td>{user.name}</Table.Td>
                                <Table.Td>{user.createdBy}</Table.Td>
                                <Table.Td>
                                    {DateTime.fromISO(
                                        user.createdDate ?? '',
                                    ).toFormat('yyyy-MM-dd HH:mm:ss')}
                                </Table.Td>
                                <Table.Td
                                    className={
                                        user.isActive
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }
                                >
                                    {user.isActive
                                        ? t('status.active')
                                        : t('status.inactive')}
                                </Table.Td>
                                <Table.Td>
                                    {getStatusText(user.status)}
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
                                                <Menu.Item
                                                    onClick={() =>
                                                        router.push(
                                                            `/admin/organizations/${user.id}`,
                                                        )
                                                    }
                                                >
                                                    Detail
                                                </Menu.Item>
                                                {user.isActive ? (
                                                    <Menu.Item
                                                        color="red"
                                                        onClick={() =>
                                                            onDeactivate({
                                                                id: user.id,
                                                                name: user.name,
                                                            })
                                                        }
                                                    >
                                                        Deactivate
                                                    </Menu.Item>
                                                ) : (
                                                    <Menu.Item
                                                        onClick={() =>
                                                            onActivate({
                                                                id: user.id,
                                                                name: user.name,
                                                            })
                                                        }
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
            </TableScrollContainer>
        </div>
    );
};

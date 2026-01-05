'use client';

import { PageTitle } from '@/components/PageContainer';
import {
    Badge,
    Button,
    Group,
    Loader,
    Menu,
    Select,
    Table,
    Text,
} from '@mantine/core';
import { useAuth } from '@shega/ui';
import { IconDots, IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import {
    type CreateProgram,
    fetchRootClasses,
    fetchRootClassesSchoolAdmin,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CreateRootClass } from '../../admin/programs/_components/CreateRootClass';

export default function RootClassPage() {
    const [programType, setProgramType] = useState<string | null>(null);
    const { user } = useAuth();
    const [loadingRow, setLoadingRow] = useState<string | null>(null);

    const { control } = useForm<CreateProgram>({
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const {
        data: rootClasses = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['rootClasses', programType],
        queryFn: () => {
            if (user?.role === 'super_admin') {
                if (!programType) {
                    return [];
                }
                return fetchRootClasses(programType);
            }

            return fetchRootClassesSchoolAdmin();
        },
        enabled:
            (user?.role === 'super_admin' && !!programType) ||
            user?.role === 'school_admin',
    });

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const rows = rootClasses.map((cls: any, index: number) => (
        <Table.Tr key={cls.id}>
            <Table.Td>{index + 1}</Table.Td>

            <Table.Td>{cls.name}</Table.Td>

            <Table.Td>
                <Badge color={cls.isActive ? 'green' : 'red'}>
                    {cls.isActive ? 'Active' : 'Inactive'}
                </Badge>
            </Table.Td>

            <Table.Td>{cls.createdBy}</Table.Td>

            <Table.Td>{new Date(cls.createdAt).toLocaleDateString()}</Table.Td>

            {/* Actions */}
            <Table.Td>
                <Menu shadow="md" width={180}>
                    <Menu.Target>
                        <Button variant="light" size="xs">
                            <IconDots size={16} />
                        </Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item
                            color="red"
                            leftSection={<IconX size={16} />}
                            disabled={loadingRow === cls.id}
                            onClick={() => console.log('inactivate')}
                        >
                            {loadingRow === cls.id
                                ? 'Processing...'
                                : 'Inactivate'}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div>
            {/* Header Section */}
            <PageTitle>Root Classes</PageTitle>
            <Group justify="space-between" className="my-4">
                <Controller
                    name="programType"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Program Type"
                            placeholder="Select Program Type"
                            data={[
                                {
                                    value: 'SS1_12',
                                    label: 'Sunday School 1 - 12',
                                },
                                {
                                    value: 'SS_Course',
                                    label: 'Sunday School Course',
                                },
                            ]}
                            value={programType}
                            onChange={(value) => {
                                setProgramType(value);
                                field.onChange(value);
                            }}
                        />
                    )}
                />
                {user?.role === 'super_admin' && (
                    <CreateRootClass
                        programId={programType ?? ''}
                        disabled={!programType}
                        onCloseRefresh={refetch}
                    />
                )}
            </Group>

            {/* Table */}
            <Table withColumnBorders striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={40}>No</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Created By</Table.Th>
                        <Table.Th>Created At</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {isLoading ? (
                        <Table.Tr>
                            <Table.Td colSpan={6}>
                                <Group justify="center">
                                    <Loader size="sm" />
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                        // biome-ignore lint/nursery/noNestedTernary: <explanation>
                    ) : rootClasses.length === 0 ? (
                        <Table.Tr>
                            <Table.Td
                                colSpan={6}
                                style={{ textAlign: 'center' }}
                            >
                                <Text c="dimmed">No root classes found.</Text>
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        rows
                    )}
                </Table.Tbody>
            </Table>
        </div>
    );
}

'use client';

import { PageContainer, PageTitle } from '@/components/PageContainer';
import {
    ActionIcon,
    Button,
    Card,
    Center,
    Group,
    LoadingOverlay,
    Menu,
    Paper,
    Stack,
    Table,
    TableScrollContainer,
    Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDots, IconEye, IconPencil, IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import router from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { CreateSubDepartmentDrawer } from '../components/CreateSubDepartment.drawer';
import { fetchDepartmentById, fetchDepartmentByParentId } from '../schemas/api';
import type { DepartmentResponse } from '../schemas/type';

export default function DepartmentDetailPage() {
    const { id } = useParams<{ id: string }>();
    // TODO: will make it by it's own response later
    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'delete'>(
        'create',
    );
    const [editDepartment, setEditDepartment] =
        useState<DepartmentResponse | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loadingDepartment, setLoadingDepartment] = useState(false);

    const handleEditClick = (department: DepartmentResponse) => {
        setEditDepartment(department);
        setDrawerMode('edit');
        setDrawerOpen(true);
    };

    const handleCreateClick = (department: DepartmentResponse) => {
        setEditDepartment(department);
        setDrawerMode('create');
        setDrawerOpen(true);
    };

    const handleDeleteClick = (test: DepartmentResponse) => {
        setEditDepartment(test);
        setDrawerMode('delete');
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setEditDepartment(null);
    };

    const handleDrawerCompleted = () => {
        fetchSubDepartments();
        handleDrawerClose();
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const fetchSubDepartments = useCallback(async () => {
        try {
            setLoadingDepartment(true);
            const data = await fetchDepartmentByParentId(id);
            setDepartments(data);
        } finally {
            setLoadingDepartment(false);
        }
    }, []);

    useEffect(() => {
        fetchSubDepartments();
    }, [fetchSubDepartments]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['department', id],
        queryFn: () => fetchDepartmentById(id),
    });

    if (isLoading || !data) {
        return <LoadingOverlay />;
    }

    return (
        <PageContainer>
            <PageTitle>Department Detail</PageTitle>
            {/* 🔹 Department Info Section */}
            <Card shadow="sm" withBorder p="lg" radius="md" mt="md">
                <Stack gap="xs">
                    <Group justify="space-between">
                        <Text fw={600}>Department Name:</Text>
                        <Text>{data?.name}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={600}>Status:</Text>
                        <Text c={data?.isActive ? 'green' : 'red'}>
                            {data?.isActive ? 'Active' : 'Inactive'}
                        </Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={600}>Description:</Text>
                        <Text>{data?.description}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={600}>Created By:</Text>
                        <Text>{data?.createdBy}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={600}>Created At:</Text>
                        <Text>{data?.createdAt}</Text>
                    </Group>
                </Stack>
            </Card>
            <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
                <Group
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                    mb="md"
                >
                    <Text fw={700}> Sub Departments</Text>
                    <Button onClick={() => handleCreateClick(data)}>
                        + Add Sub Department
                    </Button>
                </Group>

                <CreateSubDepartmentDrawer
                    mode={drawerMode}
                    department={editDepartment}
                    opened={drawerOpen}
                    onClose={handleDrawerClose}
                    onCompleted={handleDrawerCompleted}
                />

                {departments?.length === 0 ? (
                    <Center h={200}>
                        <Text c="dimmed" ta="center">
                            You haven&apos;t added any sub departments yet.
                        </Text>
                    </Center>
                ) : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                isMobile ? (
                    <Stack>
                        {departments.map((department) => (
                            <Card
                                key={department.id}
                                shadow="sm"
                                p="lg"
                                radius="md"
                                withBorder
                            >
                                <Text fw={500}>{department.name}</Text>
                            </Card>
                        ))}
                    </Stack>
                ) : (
                    <TableScrollContainer minWidth={800} type="native">
                        <Table striped>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Department Name</Table.Th>
                                    <Table.Th>Created By</Table.Th>
                                    <Table.Th>Created At</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {departments.map((department, index) => (
                                    <Table.Tr key={department.id}>
                                        <Table.Td
                                            style={{ maxWidth: '400px' }}
                                            title={department.name}
                                        >
                                            {department.name.length > 100
                                                ? `${department.name.substring(0, 100)}...`
                                                : department.name}
                                        </Table.Td>
                                        <Table.Td>
                                            {department.createdBy}
                                        </Table.Td>
                                        <Table.Td>
                                            {department.createdAt}
                                        </Table.Td>
                                        <Table.Td>
                                            {department.description}
                                        </Table.Td>
                                        <Table.Td>
                                            <Menu
                                                shadow="md"
                                                width={200}
                                                position="bottom-end"
                                            >
                                                <Menu.Target>
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="gray"
                                                    >
                                                        <IconDots size={16} />
                                                    </ActionIcon>
                                                </Menu.Target>
                                                <Menu.Dropdown>
                                                    <Menu.Item
                                                        leftSection={
                                                            <IconEye
                                                                size={16}
                                                            />
                                                        }
                                                        onClick={() =>
                                                            router.push(
                                                                `/school_admin/department/${department.id}`,
                                                            )
                                                        }
                                                    >
                                                        View Details
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        leftSection={
                                                            <IconPencil
                                                                size={16}
                                                            />
                                                        }
                                                        onClick={() =>
                                                            handleEditClick(
                                                                department,
                                                            )
                                                        }
                                                    >
                                                        Edit Department
                                                    </Menu.Item>
                                                    <Menu.Divider />
                                                    <Menu.Item
                                                        // Add your delete/inactivate logic here
                                                        color="red"
                                                        leftSection={
                                                            <IconX size={16} />
                                                        }
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                department,
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                        {department.isActive
                                                            ? 'Deactivate'
                                                            : 'Activate'}
                                                    </Menu.Item>
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </TableScrollContainer>
                )}
            </Paper>
        </PageContainer>
    );
}

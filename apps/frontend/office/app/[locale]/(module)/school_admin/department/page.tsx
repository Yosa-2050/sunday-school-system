'use client';

import { PageContainer, PageTitle } from '@/components/PageContainer';
import { useRouter } from '@/i18n/routing';
import {
    ActionIcon,
    // Badge,
    Button,
    Card,
    Center,
    Group,
    Menu,
    Paper,
    Stack,
    Table,
    TableScrollContainer,
    Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { PER_PAGE, entityParamSchema } from '@shega/shared';
import { IconDots, IconEye, IconPencil, IconX } from '@tabler/icons-react';
// import parse from 'html-react-parser';
import { useTranslations } from 'next-intl';
import { parseAsJson, useQueryState } from 'nuqs';
import { useCallback, useEffect, useState } from 'react';
import { CreateDepartmentDrawer } from './components/CreateDepartment.drawer';
import { fetchDepartmentsApi } from './schemas/api';
import type { DepartmentResponse } from './schemas/type';

const DepartmentList = () => {
    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
    const [loadingDepartment, setLoadingDepartment] = useState(false);
    const [editDepartment, setEditDepartment] =
        useState<DepartmentResponse | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'delete'>(
        'create',
    );
    const router = useRouter();
    const t = useTranslations('departmentsPage');
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [entityParams] = useQueryState(
        'departments',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: PER_PAGE,
            o: [{ f: 'createdAt', d: 'desc' }],
        }),
    );
    const handleEditClick = (department: DepartmentResponse) => {
        setEditDepartment(department);
        setDrawerMode('edit');
        setDrawerOpen(true);
    };

    const handleCreateClick = () => {
        setEditDepartment(null);
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
        fetchDepartments();
        handleDrawerClose();
    };

    const fetchDepartments = useCallback(async () => {
        try {
            setLoadingDepartment(true);
            const data = await fetchDepartmentsApi();
            setDepartments(data);
        } finally {
            setLoadingDepartment(false);
        }
    }, []);

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    return (
        <PageContainer className="flex flex-col gap-2.5">
            <Paper shadow="xs" p="sm" style={{ borderRadius: '10px' }}>
                <PageTitle>List of Departments</PageTitle>

                <Group
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                    mb="md"
                >
                    <Text fw={500}>Department</Text>
                    <Button onClick={handleCreateClick}>
                        + Add Department
                    </Button>
                </Group>

                <CreateDepartmentDrawer
                    mode={drawerMode}
                    department={editDepartment}
                    opened={drawerOpen}
                    onClose={handleDrawerClose}
                    onCompleted={handleDrawerCompleted}
                />
            </Paper>
            <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
                {departments.length === 0 ? (
                    <Center h={200}>
                        <Text c="dimmed" ta="center">
                            You haven&apos;t posted any departments yet.
                        </Text>
                    </Center>
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
};

export default DepartmentList;

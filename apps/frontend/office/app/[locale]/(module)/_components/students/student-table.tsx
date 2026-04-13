'use client';
import { ActionIcon, Center, Loader, Menu, Table, Text } from '@mantine/core';
import { IconDots, IconEdit, IconEye, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import type { StudentResponse } from '../../school_admin/students/schemas/type';

interface StudentTableProps {
    students: StudentResponse[];
    loading: boolean;
    hasLoadedStudents: boolean;
    hasSelection: boolean;
    rowOffset?: number;
    onView: (id: string) => void;
}

export function StudentTable({
    students,
    loading,
    hasLoadedStudents,
    hasSelection,
    rowOffset = 0,
    onView,
}: StudentTableProps) {
    return (
        <Table withColumnBorders striped highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>No</Table.Th>
                    <Table.Th>Id Number</Table.Th>
                    <Table.Th>Full Name</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {loading ? (
                    <Table.Tr>
                        <Table.Td colSpan={5}>
                            <Center py="xl">
                                <Loader size="sm" />
                            </Center>
                        </Table.Td>
                    </Table.Tr>
                ) : !hasSelection || !hasLoadedStudents ? (
                    <Table.Tr>
                        <Table.Td colSpan={5}>
                            <Text ta="center" c="dimmed" py="xl">
                                Select class and load student
                            </Text>
                        </Table.Td>
                    </Table.Tr>
                ) : students.length === 0 ? (
                    <Table.Tr>
                        <Table.Td colSpan={5}>
                            <Text ta="center" c="dimmed" py="xl">
                                No student found
                            </Text>
                        </Table.Td>
                    </Table.Tr>
                ) : (
                    students.map((student, index) => (
                        <Table.Tr key={student.id}>
                            <Table.Td>{rowOffset + index + 1}</Table.Td>
                            <Table.Td>{student.idNumber}</Table.Td>
                            <Table.Td>
                                {student.firstName} {student.middleName} {student.lastName}
                            </Table.Td>
                            <Table.Td>
                                {student.isActive ? 'Active' : 'Inactive'}
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
                                            leftSection={<IconEye size={16} />}
                                            onClick={() => onView(student.id)}
                                        >
                                            View Details
                                        </Menu.Item>
                                        <Menu.Item
                                            leftSection={<IconEdit size={16} />}
                                            component={Link}
                                            href={
                                                '/school_admin/students/create'
                                            }
                                        >
                                            Edit Student
                                        </Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item
                                            leftSection={<IconX size={16} />}
                                            color="red"
                                        >
                                            {student.isActive
                                                ? 'Deactivate'
                                                : 'Activate'}
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Table.Td>
                        </Table.Tr>
                    ))
                )}
            </Table.Tbody>
        </Table>
    );
}

'use client';

import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Group,
    LoadingOverlay,
    Menu,
    Modal,
    Select,
    Table,
    Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
    IconCheck,
    IconCircleCheck,
    IconCircleX,
    IconDots,
    IconEdit,
    IconTrash,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { showError, showSuccess } from 'utilities/notification';
import { fetchSubjectsAssignmentApi } from '../../assign_subject/schemas/api';
import { fetchClassesApi } from '../../classes/create/components/schema/fetchClassesDetail';
import {
    completeAttendanceApi,
    deleteAttendanceApi,
    fetchAttendanceDetailsApi,
} from '../schemas/api';

export default function AttendanceDetailTable() {
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [
        deleteModalOpened,
        { open: openDeleteModal, close: closeDeleteModal },
    ] = useDisclosure(false);
    const [attendanceToDelete, setAttendanceToDelete] = useState<string | null>(
        null,
    );

    const queryClient = useQueryClient();

    // Fetch classes for filters
    const { data: classes = [] } = useQuery({
        queryKey: ['classes'],
        queryFn: fetchClassesApi,
    });

    // Fetch sections for the selected class
    const { data: sections = [] } = useQuery({
        queryKey: ['sections', selectedClass],
        queryFn: async () => {
            if (!selectedClass) {
                return [];
            }
            const classData = classes.find((c) => c.id === selectedClass);
            return classData?.sections || [];
        },
        enabled: !!selectedClass,
    });

    // Fetch subjects based on class or section
    const { data: subjects = [] } = useQuery({
        queryKey: ['subjects', selectedClass, selectedSection],
        queryFn: () =>
            fetchSubjectsAssignmentApi(selectedSection || selectedClass || ''),
        enabled: !!(selectedClass || selectedSection),
    });

    // Fetch attendance details with filters
    const {
        data: attendanceDetails = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: [
            'attendanceDetails',
            selectedClass,
            selectedSection,
            selectedSubject,
        ],
        queryFn: () =>
            fetchAttendanceDetailsApi(
                selectedSection || selectedClass || '',
                selectedSubject || '',
            ),
    });

    // Complete attendance mutation
    const completeMutation = useMutation({
        mutationFn: completeAttendanceApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendanceDetails'] });
            notifications.show({
                title: 'Success',
                message: 'Attendance marked as completed',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: 'Failed to complete attendance',
                color: 'red',
            });
        },
    });

    // Delete attendance mutation
    const deleteMutation = useMutation({
        mutationFn: deleteAttendanceApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendanceDetails'] });
            showSuccess('Deleted successfully');
            closeDeleteModal();
        },
        onError: (error: Error) => {
            showError(error.message);
        },
    });

    const handleComplete = (attendanceId: string) => {
        completeMutation.mutate(attendanceId);
    };

    const handleDeleteClick = (attendanceId: string) => {
        setAttendanceToDelete(attendanceId);
        openDeleteModal();
    };

    const confirmDelete = () => {
        if (attendanceToDelete) {
            deleteMutation.mutate(attendanceToDelete);
        }
    };

    const handleClassChange = (classId: string | null) => {
        setSelectedClass(classId);
        setSelectedSection(null); // Reset section when class changes
        setSelectedSubject(null); // Reset subject when class changes
    };

    const rows = attendanceDetails.map((item) => (
        <Table.Tr key={item.id}>
            <Table.Td>{item.className}</Table.Td>
            <Table.Td>{item.subjectName || 'Not assigned'}</Table.Td>
            <Table.Td>{item.teacherName || 'Not assigned'}</Table.Td>
            <Table.Td>{new Date(item.date).toLocaleDateString()}</Table.Td>
            <Table.Td>
                {item.isCompleted ? (
                    <Badge
                        color="green"
                        leftSection={<IconCircleCheck size={14} />}
                    >
                        Completed
                    </Badge>
                ) : (
                    <Badge
                        color="orange"
                        leftSection={<IconCircleX size={14} />}
                    >
                        Pending
                    </Badge>
                )}
            </Table.Td>
            <Table.Td>
                <Group gap={4}>
                    <Badge color="green">{item.presentCount} Present</Badge>
                    <Badge color="red">{item.absentCount} Absent</Badge>
                </Group>
            </Table.Td>
            <Table.Td>
                <Menu shadow="md" width={180}>
                    <Menu.Target>
                        <ActionIcon variant="light" size="lg">
                            <IconDots size={16} />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {!item.isCompleted && (
                            <Menu.Item
                                leftSection={<IconCheck size={16} />}
                                onClick={() => handleComplete(item.id)}
                            >
                                Complete
                            </Menu.Item>
                        )}
                        <Menu.Item
                            color="green"
                            leftSection={<IconEdit size={16} />}
                            onClick={() => handleDeleteClick(item.id)}
                        >
                            Edit
                        </Menu.Item>

                        <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={16} />}
                            onClick={() => handleDeleteClick(item.id)}
                        >
                            Delete
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Box pt="md">
            {/* Filters */}
            <Group mb="md">
                <Box>
                    <Text size="sm" fw={500} mb={5}>
                        Filter by Class:
                    </Text>
                    <Select
                        placeholder="All classes"
                        value={selectedClass}
                        onChange={handleClassChange}
                        data={[
                            { value: '', label: 'All classes' },
                            ...classes.map((c) => ({
                                value: c.id,
                                label: c.name,
                            })),
                        ]}
                        style={{ width: 200 }}
                        clearable
                    />
                </Box>

                {/* Section Filter (only show if class has sections) */}
                {selectedClass && sections.length > 0 && (
                    <Box>
                        <Text size="sm" fw={500} mb={5}>
                            Filter by Section:
                        </Text>
                        <Select
                            placeholder="All sections"
                            value={selectedSection}
                            onChange={setSelectedSection}
                            data={[
                                { value: '', label: 'All sections' },
                                ...sections.map((s) => ({
                                    value: s.id,
                                    label: s.name,
                                })),
                            ]}
                            style={{ width: 200 }}
                            clearable
                        />
                    </Box>
                )}

                <Box>
                    <Text size="sm" fw={500} mb={5}>
                        Filter by Subject:
                    </Text>
                    <Select
                        placeholder="All subjects"
                        value={selectedSubject}
                        onChange={setSelectedSubject}
                        data={[
                            { value: '', label: 'All subjects' },
                            ...subjects.map((s) => ({
                                value: s.id,
                                label: s.subjectTitle,
                            })),
                        ]}
                        style={{ width: 200 }}
                        clearable
                        disabled={!(selectedClass || selectedSection)}
                    />
                </Box>

                <Box style={{ alignSelf: 'flex-end' }}>
                    <Button
                        onClick={() => refetch()}
                        loading={isLoading}
                        style={{ marginTop: 25 }}
                    >
                        Refresh
                    </Button>
                </Box>
            </Group>

            {/* Attendance Details Table */}
            <Table withColumnBorders striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Class</Table.Th>
                        <Table.Th>Subject</Table.Th>
                        <Table.Th>Teacher</Table.Th>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Attendance Summary</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {isLoading ? (
                        <Table.Tr>
                            <Table.Td
                                colSpan={7}
                                style={{ textAlign: 'center' }}
                            >
                                <LoadingOverlay visible={true} />
                            </Table.Td>
                        </Table.Tr>
                        // biome-ignore lint/nursery/noNestedTernary: <explanation>
                    ) : attendanceDetails.length === 0 ? (
                        <Table.Tr>
                            <Table.Td
                                colSpan={7}
                                style={{ textAlign: 'center' }}
                            >
                                No attendance records found
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        rows
                    )}
                </Table.Tbody>
            </Table>

            {/* Delete Confirmation Modal */}
            <Modal
                opened={deleteModalOpened}
                onClose={closeDeleteModal}
                title="Confirm Delete"
                centered
            >
                <Text mb="md">
                    Are you sure you want to delete this attendance record? This
                    action cannot be undone.
                </Text>
                <Group justify="flex-end">
                    <Button variant="default" onClick={closeDeleteModal}>
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        loading={deleteMutation.isPending}
                        onClick={confirmDelete}
                    >
                        Delete
                    </Button>
                </Group>
            </Modal>
        </Box>
    );
}

'use client';

import { PageTitle } from '@/components/PageContainer';
import {
    Box,
    Button,
    Card,
    Checkbox,
    Group,
    Input,
    Loader,
    Select,
    Stack,
    Table,
    Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import type { GetClass } from '../../classes/create/components/schema/fetchClassesDetail';
import type { StudentResponse } from '../../students/schemas/type';
import {
    SendNotificationForSelectedStudentApi,
    sendNotificationForClassApi,
} from '../schemas/api';

interface NotificationSendToClassProps {
    classes: GetClass[];
    selectedClass: string | null;
    setSelectedClass: (classId: string | null) => void;
    students: StudentResponse[];
    loadingStudents: boolean;
    handleFetchStudents: () => void;
}

export default function NotificationSendToClass({
    classes,
    selectedClass,
    setSelectedClass,
    students,
    loadingStudents,
    handleFetchStudents,
}: NotificationSendToClassProps) {
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [text, setText] = useState('');

    const toggleStudentSelection = (
        studentId: string,
        checked: boolean,
    ): void => {
        setSelectedStudents((prev) =>
            checked
                ? [...prev, studentId]
                : prev.filter((id) => id !== studentId),
        );
    };
    const handleSendNotificationForClass = async () => {
        if (!selectedClass) {
            notifications.show({
                title: 'Error',
                message: 'Please select a class first',
                color: 'red',
            });
            return;
        }
        if (!text.trim()) {
            notifications.show({
                title: 'Error',
                message: 'Message cannot be empty',
                color: 'red',
            });
            return;
        }
        try {
            const response = await sendNotificationForClassApi(
                text,
                selectedClass,
            );

            notifications.show({
                title: 'Success',
                message: 'Notification sent successfully',
                color: 'green',
            });
        } catch (err) {
            //add error here
        }
    };

    const handleSendNotificationForStudent = async () => {
        if (selectedStudents.length === 0) {
            notifications.show({
                title: 'Error',
                message: 'Please select at least one student',
                color: 'red',
            });
            return;
        }
        if (!text.trim()) {
            notifications.show({
                title: 'Error',
                message: 'Message cannot be empty',
                color: 'red',
            });
            return;
        }
        try {
            const response = await SendNotificationForSelectedStudentApi(
                text,
                selectedStudents,
            );

            notifications.show({
                title: 'Success',
                message: 'Notification sent successfully',
                color: 'green',
            });
        } catch (err) {
            //add error here
        }
    };

    const rows =
        students && students.length > 0 ? (
            students.map((student, index) => (
                <Table.Tr key={student.id}>
                    <Table.Td className="text-center">
                        <Checkbox
                            checked={selectedStudents.includes(student.id)}
                            onChange={(e) =>
                                toggleStudentSelection(
                                    student.id,
                                    e.currentTarget.checked,
                                )
                            }
                            aria-label={`select-student-${student.id}`}
                        />
                    </Table.Td>
                    <Table.Td className="text-center">{index + 1}</Table.Td>
                    <Table.Td className="text-center w-40">
                        {student.firstName} {student.lastName}
                    </Table.Td>
                    <Table.Td className="text-center hidden sm:table-cell">
                        {student.idNumber}
                    </Table.Td>
                </Table.Tr>
            ))
        ) : (
            <Table.Tr>
                <Table.Td colSpan={3} className="text-center">
                    No students found
                </Table.Td>
            </Table.Tr>
        );

    const disableButtons = !selectedClass;

    return (
        <Box pt="md">
            <Group mb="md" align="flex-end">
                {/*  Select Class */}
                <Box>
                    <Text size="sm" fw={500} mb={5}>
                        Select Class:
                    </Text>
                    <Select
                        placeholder="Choose class"
                        value={selectedClass}
                        onChange={setSelectedClass}
                        data={classes.map((c) => ({
                            value: c.id,
                            label: c.name,
                        }))}
                        style={{ width: 200 }}
                    />
                </Box>

                {/* Load Students */}
                <Button
                    variant="light"
                    onClick={handleFetchStudents}
                    disabled={disableButtons}
                >
                    Load Students
                </Button>
            </Group>

            {/*message */}
            <PageTitle>Message</PageTitle>
            <Card shadow="sm" withBorder p="lg" radius="md" mt="md">
                <Stack gap="xs">
                    <Input
                        type="text"
                        placeholder="Type your message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </Stack>
            </Card>

            {/* Student Table */}
            <PageTitle>Student List</PageTitle>
            <Table
                className="mt-4 border shadow w-full h-full bg-white"
                withColumnBorders
                withRowBorders
                withTableBorder
                striped
                highlightOnHover
            >
                <Table.Thead>
                    <Table.Tr className="text-center">
                        <Table.Th>Select</Table.Th>
                        <Table.Th>No</Table.Th>
                        <Table.Th className="w-40">Student</Table.Th>
                        <Table.Th className="hidden sm:table-cell">
                            ID Number
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {loadingStudents ? (
                        <Table.Tr>
                            <Table.Td colSpan={5} className="text-center">
                                <Loader size="sm" />
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        rows
                    )}
                </Table.Tbody>
            </Table>

            {/* Send Notification Buttons */}
            <Group justify="center" mt="md">
                <Button
                    onClick={handleSendNotificationForClass}
                    disabled={disableButtons}
                >
                    Send to Class
                </Button>
                <Button
                    onClick={handleSendNotificationForStudent}
                    disabled={selectedStudents.length === 0}
                >
                    Send to Selected Student
                </Button>
            </Group>
        </Box>
    );
}
function toggleStudentSelection(id: string) {
    throw new Error('Function not implemented.');
}

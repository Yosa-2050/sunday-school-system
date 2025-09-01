'use client';

import {
    ActionIcon,
    Box,
    Button,
    Flex,
    Group,
    Loader,
    Select,
    Table,
    Text,
    TextInput,
    Tooltip,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import {
    IconCircleCheck,
    IconCircleX,
    IconClock,
    IconInfoCircle,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import type { CalendarYearResponse } from 'app/[locale]/_api/admin/fetch-programs';
import { useState } from 'react';
import type { GetClass } from '../classes/create/components/schema/fetchClassesDetail';
import type { StudentResponse } from '../students/schemas/fetchStudentDetail';
import { saveAttendanceApi } from './schemas/api';
import {
    type AttendanceRecord,
    type AttendanceRequest,
    AttendanceStatus,
} from './schemas/types';

interface AttendanceCreateProps {
    classes: GetClass[];
    selectedClass: string | null;
    setSelectedClass: (classId: string | null) => void;
    selectedSection: string | null;
    setSelectedSection: (sectionId: string | null) => void;
    students: StudentResponse[];
    loadingStudents: boolean;
    handleFetchStudents: () => void;
    calendarYear: string | null;
    loadingYears: boolean;
    calendarYears: CalendarYearResponse[];
}

export default function AttendanceCreate({
    classes,
    selectedClass,
    setSelectedClass,
    selectedSection,
    setSelectedSection,
    students,
    loadingStudents,
    handleFetchStudents,
    calendarYear,
    loadingYears,
    calendarYears,
}: AttendanceCreateProps) {
    const [date, setDate] = useState<Date | null>(null);
    const [attendance, setAttendance] = useState<Record<string, string>>({});
    const [remarks, setRemarks] = useState<Record<string, string>>({});

    const saveAttendance = useMutation({
        mutationFn: async () => {
            if (!(selectedClass && date)) {
                throw new Error('Class and date are required');
            }

            const attendanceRecords: AttendanceRecord[] = students.map(
                (student) => ({
                    studentId: student.id,
                    status:
                        (attendance[student.id] as AttendanceStatus) ||
                        AttendanceStatus.ABSENT,
                    remarks: remarks[student.id] || undefined,
                }),
            );

            const attendanceData: AttendanceRequest = {
                date: date.toISOString(),
                classId: selectedClass,
                sectionId: selectedSection,
                attendance: attendanceRecords,
            };

            return saveAttendanceApi(
                selectedSection ?? selectedClass,
                attendanceData,
            );
        },
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Attendance saved successfully!',
                color: 'green',
            });
            // Reset form after successful save
            setAttendance({});
            setRemarks({});
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to save attendance',
                color: 'red',
            });
        },
    });

    const handleStatusChange = (studentId: string, value: string) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: value,
        }));
    };

    const handleRemarksChange = (studentId: string, value: string) => {
        setRemarks((prev) => ({
            ...prev,
            [studentId]: value,
        }));
    };

    const rows = students.map((student, index) => {
        const currentStatus = attendance[student.id] || '';

        return (
            <Table.Tr key={student.id}>
                <Table.Td className="text-center">{index + 1}</Table.Td>
                <Table.Td className="text-center hidden sm:table-cell">
                    {student.idNumber}
                </Table.Td>
                <Table.Td className="text-center w-40">
                    {student.firstName} {student.lastName}
                </Table.Td>
                <Table.Td>
                    <Group gap="xs" justify="center">
                        <Tooltip label="Mark as Present" withArrow>
                            <ActionIcon
                                variant={
                                    currentStatus === 'PRESENT'
                                        ? 'filled'
                                        : 'light'
                                }
                                color="green"
                                size="sm"
                                onClick={() =>
                                    handleStatusChange(student.id, 'PRESENT')
                                }
                            >
                                <IconCircleCheck size={16} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Mark as Absent" withArrow>
                            <ActionIcon
                                variant={
                                    currentStatus === 'ABSENT'
                                        ? 'filled'
                                        : 'light'
                                }
                                color="red"
                                size="sm"
                                onClick={() =>
                                    handleStatusChange(student.id, 'ABSENT')
                                }
                            >
                                <IconCircleX size={16} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Mark as Late" withArrow>
                            <ActionIcon
                                variant={
                                    currentStatus === 'LATE'
                                        ? 'filled'
                                        : 'light'
                                }
                                color="orange"
                                size="sm"
                                onClick={() =>
                                    handleStatusChange(student.id, 'LATE')
                                }
                            >
                                <IconClock size={16} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Mark as Permission" withArrow>
                            <ActionIcon
                                variant={
                                    currentStatus === 'PERMISSION'
                                        ? 'filled'
                                        : 'light'
                                }
                                color="blue"
                                size="sm"
                                onClick={() =>
                                    handleStatusChange(student.id, 'PERMISSION')
                                }
                            >
                                <IconInfoCircle size={16} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Table.Td>
                <Table.Td className="hidden md:table-cell">
                    <TextInput
                        size="xs"
                        placeholder="Remarks"
                        value={remarks[student.id] || ''}
                        onChange={(e) =>
                            handleRemarksChange(student.id, e.target.value)
                        }
                    />
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Box pt="md">
            {/* Calendar Year */}
            <Group mb="md">
                <Text>Calendar Year:</Text>
                {loadingYears ? (
                    <Loader size="sm" />
                ) : (
                    <Select
                        value={calendarYear}
                        data={calendarYears.map((y) => ({
                            value: y.name,
                            label: y.name,
                        }))}
                        disabled
                        // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
                        onChange={() => {}}
                    />
                )}
            </Group>

            <Group mb="md">
                <Select
                    placeholder="Select Class"
                    value={selectedClass}
                    onChange={(val) => {
                        setSelectedClass(val);
                        setSelectedSection(null);
                    }}
                    data={classes.map((c) => ({ value: c.id, label: c.name }))}
                />
                {selectedClass &&
                classes.find((c) => c.id === selectedClass)?.sections
                    ?.length ? (
                    <Select
                        placeholder="Select Section"
                        value={selectedSection}
                        onChange={setSelectedSection}
                        data={
                            classes
                                .find((c) => c.id === selectedClass)
                                ?.sections?.map((s) => ({
                                    value: s.id,
                                    label: s.name,
                                })) ?? []
                        }
                    />
                ) : null}

                {/* Date Selector */}
                <DatePickerInput
                    placeholder="Select Date"
                    value={date}
                    onChange={setDate}
                    valueFormat="YYYY-MM-DD"
                    clearable={false}
                />

                <Button
                    variant="light"
                    onClick={handleFetchStudents}
                    disabled={
                        !selectedClass || // no class selected
                        (classes?.find((c) => c.id === selectedClass)?.sections
                            ?.length &&
                            !selectedSection) // class has sections but section not chosen
                    }
                >
                    Load Students
                </Button>
            </Group>

            {/* Student Table */}
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
                        <Table.Th className="text-center">No</Table.Th>
                        <Table.Th className="text-center hidden sm:table-cell">
                            ID Number
                        </Table.Th>
                        <Table.Th className="text-center w-40">
                            Student
                        </Table.Th>
                        <Table.Th className="text-center">
                            <Flex direction="column" align="center" gap="xs">
                                <Text size="sm">Attendance Status</Text>
                                <Flex gap="xs" justify="center">
                                    <Tooltip label="Present" withArrow>
                                        <ActionIcon
                                            color="green"
                                            size="xs"
                                            variant="transparent"
                                        >
                                            <IconCircleCheck size={14} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label="Absent" withArrow>
                                        <ActionIcon
                                            color="red"
                                            size="xs"
                                            variant="transparent"
                                        >
                                            <IconCircleX size={14} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label="Late" withArrow>
                                        <ActionIcon
                                            color="orange"
                                            size="xs"
                                            variant="transparent"
                                        >
                                            <IconClock size={14} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label="Permission" withArrow>
                                        <ActionIcon
                                            color="blue"
                                            size="xs"
                                            variant="transparent"
                                        >
                                            <IconInfoCircle size={14} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Flex>
                                <Text size="xs" c="dimmed">
                                    Click icons to mark status
                                </Text>
                            </Flex>
                        </Table.Th>
                        <Table.Th className="text-center hidden md:table-cell">
                            Remarks
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

            <Group justify="center" mt="md">
                <Button
                    onClick={() => saveAttendance.mutate()}
                    disabled={
                        !(students.length && date) ||
                        Object.keys(attendance).length === 0
                    }
                    loading={saveAttendance.isPending}
                >
                    Save Attendance
                </Button>
            </Group>
        </Box>
    );
}

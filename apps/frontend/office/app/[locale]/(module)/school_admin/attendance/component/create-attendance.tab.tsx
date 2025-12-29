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
import { useEffect, useState } from 'react';
import { fetchSubjectsAssignmentApi } from '../../assign_subject/schemas/api';
import type { SubjectAssignmentResponse } from '../../assign_subject/schemas/type';
import type { GetClass } from '../../classes/create/components/schema/fetchClassesDetail';
import QRScanner from '../../students/components/QrScanner';
import type { StudentResponse } from '../../students/schemas/type';
import { saveAttendanceApi } from '../schemas/api';
import {
    type AttendanceRecord,
    type AttendanceRequest,
    AttendanceStatus,
} from '../schemas/types';

interface AttendanceCreateProps {
    programId: string | null;
    yearId: string | null;
    classes: GetClass[];
    selectedClass: string | null;
    setSelectedClass: (classId: string | null) => void;
    selectedSection: string | null;
    setSelectedSection: (sectionId: string | null) => void;
    students: StudentResponse[];
    loadingStudents: boolean;
    handleFetchStudents: () => void;
}

export default function AttendanceCreate({
    programId,
    yearId,
    classes,
    selectedClass,
    setSelectedClass,
    selectedSection,
    setSelectedSection,
    students,
    loadingStudents,
    handleFetchStudents,
}: AttendanceCreateProps) {
    const [date, setDate] = useState<Date | null>(null);
    const [attendance, setAttendance] = useState<Record<string, string>>({});
    const [remarks, setRemarks] = useState<Record<string, string>>({});
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [subjects, setSubject] = useState<SubjectAssignmentResponse[] | null>(
        [],
    );

    // fetch subjects when class/section changes
    useEffect(() => {
        const getSubject = async () => {
            try {
                // setLoadingYears(true);
                const data: SubjectAssignmentResponse[] =
                    await fetchSubjectsAssignmentApi(
                        selectedSection ?? selectedClass ?? '',
                    );
                setSubject(data);
            } catch (err) {
                //console.error('Failed to fetch calendar years', err);
            } finally {
                // setLoadingYears(false);
            }
        };

        getSubject();
    }, [selectedSection, selectedClass]);

    const saveAttendance = useMutation({
        mutationFn: async () => {
            if (!(selectedClass && date && selectedSubject)) {
                throw new Error('Class, subject and date are required');
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
                subjectId: selectedSubject,
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
            setAttendance({});
            setRemarks({});
            setSelectedSubject(null); // reset subject after save
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

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        setSelectedSubject(null);
        setDate(null);
    }, [selectedClass, selectedSection]);

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

    const [attendanceDataId, setAttendanceDataId] = useState(
        'current-attendance-session',
    );
    const [classId, setClassId] = useState('your-class-id');
    const [refreshCount, setRefreshCount] = useState(0);

    const handleAttendanceRecorded = () => {
        setRefreshCount((prev) => prev + 1);
    };

    const disableButtons =
        !selectedClass ||
        (!!classes?.find((c) => c.id === selectedClass)?.sections?.length &&
            !selectedSection);
    return (
        <Box pt="md">
            <Group mb="md" align="flex-end">
                {/* Class Selection */}
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

                {/* Section Selection (conditionally shown) */}
                {selectedClass &&
                classes.find((c) => c.id === selectedClass)?.sections
                    ?.length ? (
                    <Box>
                        <Text size="sm" fw={500} mb={5}>
                            Select Section:
                        </Text>
                        <Select
                            placeholder="Choose section"
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
                            style={{ width: 200 }}
                        />
                    </Box>
                ) : null}

                {/* Subject Selection (populated dynamically) */}
                <Box>
                    <Text size="sm" fw={500} mb={5}>
                        Select Subject:
                    </Text>
                    <Select
                        placeholder={'Choose subject'}
                        value={selectedSubject}
                        onChange={setSelectedSubject}
                        data={subjects?.map((s) => ({
                            value: s.id,
                            label: s.subjectTitle,
                        }))}
                        style={{ width: 200 }}
                        disabled={!subjects?.length}
                    />
                </Box>

                {/* Date Selection */}
                <Box>
                    <Text size="sm" fw={500} mb={5}>
                        Select Date:
                    </Text>
                    <DatePickerInput
                        placeholder="Choose date"
                        value={date}
                        onChange={setDate}
                        valueFormat="YYYY-MM-DD"
                        clearable={false}
                        style={{ width: 220 }}
                    />
                </Box>

                {/* Load Button */}
                <Button
                    variant="light"
                    onClick={handleFetchStudents}
                    disabled={disableButtons}
                >
                    Load Students
                </Button>

                {/* QR Scanner */}
                <QRScanner
                    onAttendanceRecorded={handleAttendanceRecorded}
                    disable={disableButtons}
                    yearId={yearId ?? ''}
                />
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
                        !(students.length && date && selectedSubject) ||
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

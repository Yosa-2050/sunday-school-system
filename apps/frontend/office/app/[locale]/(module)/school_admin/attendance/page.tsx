'use client';

import {
    ActionIcon,
    Button,
    Flex,
    Group,
    Loader,
    Select,
    Table,
    Tabs,
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
import {
    type CalendarYearResponse,
    fetchCalendarYearsSchoolAdmin,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useEffect, useState } from 'react';
import {
    type GetClass,
    fetchClassesApi,
} from '../classes/create/components/shcema/fetchClassesDetail';
import {
    type StudentResponse,
    fetchStudentsApi,
} from '../students/schemas/fetchStudentDetail';
import {
    type AttendanceRecord,
    type AttendanceRequest,
    AttendanceStatus,
    saveAttendanceApi,
} from './schemas/fetchAttendanceDetail';

export default function AttendancePage() {
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [calendarYears, setCalendarYears] = useState<CalendarYearResponse[]>(
        [],
    );
    const [loadingYears, setLoadingYears] = useState(true);
    const [classes, setClasses] = useState<GetClass[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    const [date, setDate] = useState<Date | null>(null);
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const handleFetchStudents = async () => {
        if (!selectedClass) {
            return;
        }

        setStudents([]);

        try {
            setLoadingStudents(true);
            const data = await fetchStudentsApi(
                selectedSection ?? selectedClass,
            );
            setStudents(data);
        } finally {
            setLoadingStudents(false);
        }
    };

    // Fetch calendar years
    useEffect(() => {
        const getCalendarYears = async () => {
            try {
                setLoadingYears(true);
                const data: CalendarYearResponse[] =
                    await fetchCalendarYearsSchoolAdmin();
                setCalendarYears(data);
                const active = data.find((y) => y.isActive);
                if (active) {
                    setCalendarYear(active.name);
                }
            } finally {
                setLoadingYears(false);
            }
        };

        getCalendarYears();
    }, []);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await fetchClassesApi();
                setClasses(data);
            } catch (err) {
                // handle error
            }
        };

        fetchClasses();
    }, []);

    const saveAttendance = useMutation({
        mutationFn: async () => {
            if (!(selectedClass && date)) {
                throw new Error('Class and date are required');
            }

            // Prepare attendance records
            const attendanceRecords: AttendanceRecord[] = students.map(
                (student) => ({
                    studentId: student.id,
                    status:
                        (attendance[student.id] as AttendanceStatus) ||
                        AttendanceStatus.PRESENT, // Default to absent if not set
                    remarks: remarks[student.id] || undefined,
                }),
            );

            // Prepare the request payload
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

            // Optional: Reset form state after successful save
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

    // State to track each student's attendance status
    const [attendance, setAttendance] = useState<Record<string, string>>({});
    const [remarks, setRemarks] = useState<Record<string, string>>({});

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
                    {student.fullName}
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
        <div>
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
                        onChange={setCalendarYear}
                    />
                )}
            </Group>

            <Tabs defaultValue="create">
                <Tabs.List>
                    <Tabs.Tab value="create">Create Attendance</Tabs.Tab>
                    <Tabs.Tab value="view">View Attendance</Tabs.Tab>
                </Tabs.List>

                {/* Create Attendance */}
                <Tabs.Panel value="create" pt="md">
                    <Group mb="md">
                        <Select
                            placeholder="Select Class"
                            value={selectedClass}
                            onChange={(val) => {
                                setSelectedClass(val);
                                setSelectedSection(null); // reset section when class changes
                            }}
                            data={classes.map((c) => ({
                                value: c.id,
                                label: c.name,
                            }))}
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
                                (classes?.find((c) => c.id === selectedClass)
                                    ?.sections?.length &&
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
                                    <Flex
                                        direction="column"
                                        align="center"
                                        gap="xs"
                                    >
                                        <Text size="sm">Attendance Status</Text>
                                        <Flex gap="xs" justify="center">
                                            <Tooltip label="Present" withArrow>
                                                <ActionIcon
                                                    color="green"
                                                    size="xs"
                                                    variant="transparent"
                                                >
                                                    <IconCircleCheck
                                                        size={14}
                                                    />
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
                                            <Tooltip
                                                label="Permission"
                                                withArrow
                                            >
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
                                    <Table.Td
                                        colSpan={5}
                                        className="text-center"
                                    >
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
                </Tabs.Panel>

                {/* View Attendance */}
                <Tabs.Panel value="view" pt="md">
                    <Group mb="md">
                        <Select
                            placeholder="Select Class"
                            value={selectedClass}
                            onChange={(val) => {
                                setSelectedClass(val);
                                setSelectedSection(null); // reset section when class changes
                            }}
                            data={classes.map((c) => ({
                                value: c.id,
                                label: c.name,
                            }))}
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
                        <Button
                            variant="light"
                            onClick={handleFetchStudents}
                            disabled={
                                !selectedClass || // no class selected
                                (classes?.find((c) => c.id === selectedClass)
                                    ?.sections?.length &&
                                    !selectedSection) // class has sections but section not chosen
                            }
                        >
                            Load Students
                        </Button>
                    </Group>

                    {students && (
                        <Table striped mt="md">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                                {students.map((r: any) => (
                                    <tr key={r.studentId}>
                                        <td>{r.studentName}</td>
                                        <td>{r.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Tabs.Panel>
            </Tabs>
        </div>
    );
}

'use client';

import {
    Badge,
    Box,
    Button,
    Group,
    ScrollArea,
    Select,
    Table,
    Text,
    Tooltip,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import {
    IconCalendar,
    IconCircleCheck,
    IconCircleX,
    IconClock,
    IconInfoCircle,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { GetClass } from '../classes/create/components/schema/fetchClassesDetail';
import { fetchAttendanceViewApi, fetchSavedDatesApi } from './schemas/api';
import {
    AttendanceStatus,
    type AttendanceViewRequest,
    type AttendanceViewResponse,
    type SavedDate,
} from './schemas/types';

interface AttendanceViewProps {
    classes: GetClass[];
    selectedClass: string | null;
    setSelectedClass: (classId: string | null) => void;
    selectedSection: string | null;
    setSelectedSection: (sectionId: string | null) => void;
}

export default function AttendanceView({
    classes,
    selectedClass,
    setSelectedClass,
    selectedSection,
    setSelectedSection,
}: AttendanceViewProps) {
    const [savedDates, setSavedDates] = useState<SavedDate[]>([]);
    const [selectedDateRange, setSelectedDateRange] = useState<
        [Date | null, Date | null]
    >([null, null]);
    const [attendanceViewData, setAttendanceViewData] = useState<
        AttendanceViewResponse[]
    >([]);
    const [loadingView, setLoadingView] = useState(false);

    const fetchSavedDates = async () => {
        if (!selectedClass) {
            return;
        }

        try {
            const dates = await fetchSavedDatesApi(
                selectedClass,
                selectedSection || undefined,
            );
            setSavedDates(dates);
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to fetch saved dates',
                color: 'red',
            });
        }
    };

    // useEffect(() => {
    //     if (selectedClass) {
    //         fetchSavedDates();
    //     }
    // }, [selectedClass, selectedSection]);

    const { refetch: fetchAttendanceView } = useQuery({
        queryKey: [
            'attendanceView',
            selectedClass,
            selectedSection,
            selectedDateRange,
        ],
        queryFn: async () => {
            if (!selectedClass) {
                throw new Error('Class is required');
            }

            setLoadingView(true);
            try {
                const request: AttendanceViewRequest = {
                    classId: selectedClass,
                    sectionId: selectedSection || undefined,
                    startDate: selectedDateRange[0]?.toISOString(),
                    endDate: selectedDateRange[1]?.toISOString(),
                };

                const data = await fetchAttendanceViewApi(request);
                setAttendanceViewData(data);
                return data;
            } finally {
                setLoadingView(false);
            }
        },
        enabled: false,
    });

    return (
        <Box pt="md">
            <Group mb="md">
                <Select
                    placeholder="Select Class"
                    value={selectedClass}
                    onChange={setSelectedClass}
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

                <DatePickerInput
                    type="range"
                    placeholder="Select date range"
                    value={selectedDateRange}
                    onChange={setSelectedDateRange}
                />

                <Button
                    onClick={() => fetchAttendanceView()}
                    disabled={!selectedClass}
                    loading={loadingView}
                >
                    Load Attendance
                </Button>
            </Group>

            {attendanceViewData.length > 0 && (
                <Box>
                    <Group mb="md">
                        <Text size="sm" fw={500}>
                            Saved Dates:
                        </Text>
                        <ScrollArea w={400} scrollbars="x">
                            <Group gap="xs">
                                {savedDates.map((savedDate) => (
                                    <Badge
                                        key={savedDate.attendanceInfoId}
                                        variant="light"
                                        leftSection={<IconCalendar size={12} />}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            const date = new Date(
                                                savedDate.date,
                                            );
                                            setSelectedDateRange([date, date]);
                                        }}
                                    >
                                        {savedDate.formattedDate}
                                    </Badge>
                                ))}
                            </Group>
                        </ScrollArea>
                    </Group>

                    <ScrollArea scrollbars="x">
                        <Table
                            className="border shadow bg-white"
                            withColumnBorders
                            withRowBorders
                            striped
                            highlightOnHover
                        >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th
                                        rowSpan={2}
                                        className="text-center"
                                    >
                                        No
                                    </Table.Th>
                                    <Table.Th
                                        rowSpan={2}
                                        className="text-center"
                                    >
                                        ID Number
                                    </Table.Th>
                                    <Table.Th
                                        rowSpan={2}
                                        className="text-center"
                                    >
                                        Student
                                    </Table.Th>

                                    {Object.keys(
                                        attendanceViewData[0]?.attendance || {},
                                    ).map((date) => (
                                        <Table.Th
                                            key={date}
                                            className="text-center"
                                        >
                                            {new Date(
                                                date,
                                            ).toLocaleDateString()}
                                        </Table.Th>
                                    ))}

                                    <Table.Th
                                        className="text-center"
                                        style={{ background: '#f0f9ff' }}
                                    >
                                        Total Present
                                    </Table.Th>
                                    <Table.Th
                                        className="text-center"
                                        style={{ background: '#fef2f2' }}
                                    >
                                        Total Absent
                                    </Table.Th>
                                    <Table.Th
                                        className="text-center"
                                        style={{ background: '#fffbeb' }}
                                    >
                                        Total Late
                                    </Table.Th>
                                    <Table.Th
                                        className="text-center"
                                        style={{ background: '#eff6ff' }}
                                    >
                                        Total Permission
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {attendanceViewData.map((student, index) => (
                                    <Table.Tr key={student.studentId}>
                                        <Table.Td className="text-center">
                                            {index + 1}
                                        </Table.Td>
                                        <Table.Td className="text-center">
                                            {student.idNumber}
                                        </Table.Td>
                                        <Table.Td className="text-center">
                                            {student.fullName}
                                        </Table.Td>

                                        {Object.entries(student.attendance).map(
                                            ([date, record]) => (
                                                <Table.Td
                                                    key={date}
                                                    className="text-center"
                                                >
                                                    <Tooltip
                                                        label={record.status}
                                                        withArrow
                                                    >
                                                        <Box>
                                                            {record.status ===
                                                                AttendanceStatus.PRESENT && (
                                                                <IconCircleCheck
                                                                    size={16}
                                                                    color="green"
                                                                />
                                                            )}
                                                            {record.status ===
                                                                AttendanceStatus.ABSENT && (
                                                                <IconCircleX
                                                                    size={16}
                                                                    color="red"
                                                                />
                                                            )}
                                                            {record.status ===
                                                                AttendanceStatus.LATE && (
                                                                <IconClock
                                                                    size={16}
                                                                    color="orange"
                                                                />
                                                            )}
                                                            {record.status ===
                                                                AttendanceStatus.PERMISSION && (
                                                                <IconInfoCircle
                                                                    size={16}
                                                                    color="blue"
                                                                />
                                                            )}
                                                        </Box>
                                                    </Tooltip>
                                                </Table.Td>
                                            ),
                                        )}

                                        <Table.Td
                                            className="text-center"
                                            style={{ background: '#f0f9ff' }}
                                        >
                                            <Badge color="green">
                                                {student.totals.present}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td
                                            className="text-center"
                                            style={{ background: '#fef2f2' }}
                                        >
                                            <Badge color="red">
                                                {student.totals.absent}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td
                                            className="text-center"
                                            style={{ background: '#fffbeb' }}
                                        >
                                            <Badge color="orange">
                                                {student.totals.late}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td
                                            className="text-center"
                                            style={{ background: '#eff6ff' }}
                                        >
                                            <Badge color="blue">
                                                {student.totals.permission}
                                            </Badge>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>

                    <Group mt="md" justify="center">
                        <Badge color="green" size="lg">
                            Total Students: {attendanceViewData.length}
                        </Badge>
                        <Badge color="blue" size="lg">
                            Dates Shown:{' '}
                            {
                                Object.keys(
                                    attendanceViewData[0]?.attendance || {},
                                ).length
                            }
                        </Badge>
                    </Group>
                </Box>
            )}

            {!(attendanceViewData.length || loadingView) && selectedClass && (
                <Text ta="center" c="dimmed" mt="xl">
                    No attendance records found for the selected criteria
                </Text>
            )}
        </Box>
    );
}

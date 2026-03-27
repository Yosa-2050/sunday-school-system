'use client';

import {
    Badge,
    Box,
    Button,
    Flex,
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
    IconCircleCheck,
    IconCircleX,
    IconClock,
    IconInfoCircle,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { GetClass } from '../../classes/create/components/schema/fetchClassesDetail';
import { fetchAttendanceViewApi, fetchSavedDatesApi } from '../schemas/api';
import {
    AttendanceStatus,
    type AttendanceViewRequest,
    type AttendanceViewResponse,
    type SavedDate,
} from '../schemas/types';

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

    // Add this state for the selected saved date
    const [selectedSavedDate, setSelectedSavedDate] = useState<string | null>(
        null,
    );

    const fetchSavedDates = async (classId: string) => {
        if (!selectedClass) {
            return;
        }

        try {
            const dates = await fetchSavedDatesApi(classId);
            setSavedDates(dates);
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to fetch saved dates',
                color: 'red',
            });
        }
    };

    useEffect(() => {
        if (selectedClass) {
            fetchSavedDates(selectedSection ?? selectedClass);
        }
    }, [selectedClass, selectedSection]);

    const { refetch: fetchAttendanceView } = useQuery({
        queryKey: [
            'attendanceView',
            selectedClass,
            selectedSavedDate,
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
                    classId: selectedSection ?? selectedClass,
                    attendanceInfoId: selectedSavedDate || undefined,
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

    useEffect(() => {
        setSavedDates([]);
        setSelectedDateRange([null, null]);
        setAttendanceViewData([]);
    }, [selectedClass, selectedSection]);

    return (
        <Box pt="md">
            <Group mb="md">
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

                {/* Saved Dates Selector */}
                <Box>
                    <Text size="sm" fw={500} mb={5}>
                        Saved Dates:
                    </Text>
                    <Select
                        placeholder="Choose from saved dates"
                        data={savedDates.map((savedDate) => ({
                            value: savedDate.id,
                            label: savedDate.date,
                        }))}
                        onChange={setSelectedSavedDate}
                        style={{ width: 200 }}
                        clearable
                    />
                </Box>

                {/* Date Range Selector */}
                <Box>
                    <Text size="sm" fw={500} mb={5}>
                        Custom Date Range:
                    </Text>
                    <DatePickerInput
                        type="range"
                        placeholder="Select date range"
                        value={selectedDateRange}
                        onChange={setSelectedDateRange}
                        style={{ width: 250 }}
                    />
                </Box>

                {/* Load Button */}
                <Box style={{ alignSelf: 'flex-end' }}>
                    <Button
                        onClick={() => fetchAttendanceView()}
                        disabled={!selectedClass}
                        loading={loadingView}
                        style={{ marginTop: 25 }}
                    >
                        Load Attendance
                    </Button>
                </Box>
            </Group>

            {attendanceViewData.length > 0 && (
                <Box>
                    <Flex gap="md" align="flex-start">
                        {/* Fixed Student Info Table */}
                        <Box style={{ flex: '0 0 auto' }}>
                            <Table withColumnBorders withRowBorders striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th className="text-center">
                                            No
                                        </Table.Th>
                                        <Table.Th className="text-center">
                                            ID Number
                                        </Table.Th>
                                        <Table.Th className="text-center">
                                            Student
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {attendanceViewData.map(
                                        (student, index) => (
                                            <Table.Tr
                                                key={student.studentId}
                                                style={{ height: '53px' }}
                                            >
                                                <Table.Td className="text-center">
                                                    {index + 1}
                                                </Table.Td>
                                                <Table.Td className="text-center">
                                                    {student.idNumber}
                                                </Table.Td>
                                                <Table.Td
                                                    className="text-center"
                                                    style={{
                                                        minWidth: '200px',
                                                    }}
                                                >
                                                    {student.fullName}
                                                </Table.Td>
                                            </Table.Tr>
                                        ),
                                    )}
                                </Table.Tbody>
                            </Table>
                        </Box>

                        {/* Scrollable Attendance Dates */}
                        <ScrollArea scrollbars="x" style={{ flex: '1' }}>
                            <Table withColumnBorders withRowBorders striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        {Object.keys(
                                            attendanceViewData[0]?.attendance ||
                                                {},
                                        ).map((date) => (
                                            <Table.Th
                                                key={date}
                                                className="text-center"
                                                style={{ minWidth: '80px' }}
                                            >
                                                {new Date(
                                                    date,
                                                ).toLocaleDateString()}
                                            </Table.Th>
                                        ))}
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {attendanceViewData.map((student) => (
                                        <Table.Tr
                                            key={student.studentId}
                                            style={{ height: '53px' }}
                                        >
                                            {Object.entries(
                                                student.attendance,
                                            ).map(([date, record]) => (
                                                <Table.Td
                                                    key={date}
                                                    className="text-center"
                                                    style={{
                                                        textAlign: 'center',
                                                        padding: '8px',
                                                        minWidth: '70px',
                                                        maxWidth: '70px',
                                                    }}
                                                >
                                                    <Tooltip
                                                        label={`${record.status}${record.remarks ? ` - ${record.remarks}` : ''}`}
                                                        withArrow
                                                    >
                                                        <Box
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent:
                                                                    'center',
                                                                alignItems:
                                                                    'center',
                                                                width: '100%',
                                                                height: '100%',
                                                            }}
                                                        >
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
                                            ))}
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>

                        {/* Fixed Totals Table */}
                        <Box style={{ flex: '0 0 auto' }}>
                            <Table withColumnBorders withRowBorders striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th
                                            className="text-center"
                                            style={{
                                                background: '#f0f9ff',
                                                minWidth: '100px',
                                            }}
                                        >
                                            Total Present
                                        </Table.Th>
                                        <Table.Th
                                            className="text-center"
                                            style={{
                                                background: '#fef2f2',
                                                minWidth: '100px',
                                            }}
                                        >
                                            Total Absent
                                        </Table.Th>
                                        <Table.Th
                                            className="text-center"
                                            style={{
                                                background: '#fffbeb',
                                                minWidth: '100px',
                                            }}
                                        >
                                            Total Late
                                        </Table.Th>
                                        <Table.Th
                                            className="text-center"
                                            style={{
                                                background: '#eff6ff',
                                                minWidth: '100px',
                                            }}
                                        >
                                            Total Permission
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {attendanceViewData.map((student) => (
                                        <Table.Tr
                                            key={student.studentId}
                                            style={{ height: '53px' }}
                                        >
                                            <Table.Td
                                                className="text-center"
                                                style={{
                                                    background: '#f0f9ff',
                                                }}
                                            >
                                                <Badge color="green">
                                                    {student.totals.present}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td
                                                className="text-center"
                                                style={{
                                                    background: '#fef2f2',
                                                }}
                                            >
                                                <Badge color="red">
                                                    {student.totals.absent}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td
                                                className="text-center"
                                                style={{
                                                    background: '#fffbeb',
                                                }}
                                            >
                                                <Badge color="orange">
                                                    {student.totals.late}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td
                                                className="text-center"
                                                style={{
                                                    background: '#eff6ff',
                                                }}
                                            >
                                                <Badge color="blue">
                                                    {student.totals.permission}
                                                </Badge>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Box>
                    </Flex>

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

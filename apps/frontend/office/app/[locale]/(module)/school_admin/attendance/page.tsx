'use client';

import { Group, Loader, Select, Tabs, Text } from '@mantine/core';
import {
    type CalendarYearResponse,
    fetchCalendarYearsSchoolAdmin,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useEffect, useState } from 'react';
import {
    type GetClass,
    fetchClassesApi,
} from '../classes/create/components/schema/fetchClassesDetail';
import { fetchStudentsApi } from '../students/schemas/api';
import type { StudentResponse } from '../students/schemas/type';
import AttendanceCreate from './CreateAttendance';
import AttendanceView from './ViewAttendance';

export default function AttendancePage() {
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [calendarYears, setCalendarYears] = useState<CalendarYearResponse[]>(
        [],
    );
    const [loadingYears, setLoadingYears] = useState(true);
    const [classes, setClasses] = useState<GetClass[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
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
                        // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
                        onChange={() => {}}
                    />
                )}
            </Group>
            <Tabs defaultValue="create">
                <Tabs.List>
                    <Tabs.Tab value="create">Create Attendance</Tabs.Tab>
                    <Tabs.Tab value="view">View Attendance</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="create" pt="md">
                    <AttendanceCreate
                        classes={classes}
                        selectedClass={selectedClass}
                        setSelectedClass={setSelectedClass}
                        selectedSection={selectedSection}
                        setSelectedSection={setSelectedSection}
                        students={students}
                        loadingStudents={loadingStudents}
                        handleFetchStudents={handleFetchStudents}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="view" pt="md">
                    <AttendanceView
                        classes={classes}
                        selectedClass={selectedClass}
                        setSelectedSection={setSelectedSection}
                        selectedSection={selectedSection}
                        setSelectedClass={setSelectedClass}
                    />
                </Tabs.Panel>
            </Tabs>
        </div>
    );
}

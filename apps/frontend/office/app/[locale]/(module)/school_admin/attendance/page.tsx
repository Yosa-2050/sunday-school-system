'use client';

import { Tabs } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ProgramAndCalendarSelector } from '../classes/create/components/programAndCalendar';
import {
    type GetClass,
    fetchClassesApi,
} from '../classes/create/components/schema/fetchClassesDetail';
import { fetchStudentsApi } from '../students/schemas/api';
import type { StudentResponse } from '../students/schemas/type';
import AttendanceDetailTable from './component/attendance-data.tab';
import AttendanceCreate from './component/create-attendance.tab';
import AttendanceView from './component/view-attendance.tab';

export default function AttendancePage() {
    const [calendarYearId, setCalendarYearId] = useState<string | null>(null);
    const [programId, setProgramId] = useState<string | null>(null);
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [loadingYears, setLoadingYears] = useState(true);
    const [classes, setClasses] = useState<GetClass[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const handleFetchStudents = async () => {
        if (!selectedClass) {
            setStudents([]);
            return;
        }
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

    const fetchClasses = async (calenderId: string) => {
        setClasses([]);
        setSelectedClass(null);
        try {
            const data = await fetchClassesApi(calenderId ?? '');
            setClasses(data);
            setSelectedClass(null);
            setSelectedSection(null);
        } catch (err) {
            // handle error
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        setStudents([]);
    }, [selectedClass, selectedSection]);

    return (
        <div>
            <ProgramAndCalendarSelector
                onChange={({ programId, calenderYearId, calenderYearName }) => {
                    setSelectedClass(null);
                    setSelectedSection(null);
                    setStudents([]);
                    setProgramId(programId);
                    setCalendarYear(calenderYearName);
                    setCalendarYearId(calenderYearId);
                    fetchClasses(calenderYearId ?? '');
                }}
            />
            <Tabs defaultValue="create">
                <Tabs.List>
                    <Tabs.Tab value="create">Create Attendance</Tabs.Tab>
                    <Tabs.Tab value="view">View Attendance</Tabs.Tab>
                    <Tabs.Tab value="detail">View Attendance Detail</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="create" pt="md">
                    <AttendanceCreate
                        yearId={calendarYearId}
                        programId={programId}
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

                <Tabs.Panel value="detail" pt="md">
                    <AttendanceDetailTable classes={classes ?? []} />
                </Tabs.Panel>
            </Tabs>
        </div>
    );
}

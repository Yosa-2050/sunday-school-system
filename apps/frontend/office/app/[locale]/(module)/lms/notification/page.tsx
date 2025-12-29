'use client';

import { Group, Tabs, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ProgramAndCalendarSelector } from '../../school_admin/classes/create/components/programAndCalendar';
import {
    type GetClass,
    fetchClassesApi,
} from '../../school_admin/classes/create/components/schema/fetchClassesDetail';
import { fetchStudentsApi } from '../../school_admin/students/schemas/api';
import type { StudentResponse } from '../../school_admin/students/schemas/type';
import StudentDetailPage from './component/send-to-all.tab';
import NotificationSendToClass from './component/send-to-class.tab';

export default function AttendancePage() {
    const [programId, setProgramId] = useState<string | null>(null);
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [calendarYearId, setCalendarYearId] = useState<string | null>(null);
    const [classes, setClasses] = useState<GetClass[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const handleFetchStudents = async () => {
        if (!selectedClass) {
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

    useEffect(() => {
        setStudents([]);
        setClasses([]);
        if (!programId) {
            return;
        }
        const fetchClasses = async () => {
            try {
                const data = await fetchClassesApi(calendarYearId ?? '');
                setClasses(data);
            } catch (err) {
                // handle error (optional)
            }
        };

        fetchClasses();
    }, [calendarYearId, programId]);

    return (
        <div>
            <ProgramAndCalendarSelector
                onChange={({ programId, calenderYearId, calenderYearName }) => {
                    setProgramId(programId);
                    setCalendarYear(calenderYearName);
                    setCalendarYearId(calenderYearId);
                    setSelectedClass(null);
                    setSelectedSection(null);
                    setClasses([]);
                    setStudents([]);
                }}
            />
            <Group mb="md">
                <Text>Send Notifications To:</Text>
            </Group>

            <Tabs defaultValue="all">
                <Tabs.List>
                    <Tabs.Tab value="all">All</Tabs.Tab>
                    <Tabs.Tab value="view">Class</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="view" pt="md">
                    <NotificationSendToClass
                        classes={classes}
                        selectedClass={selectedClass}
                        setSelectedClass={setSelectedClass}
                        students={students}
                        loadingStudents={loadingStudents}
                        handleFetchStudents={handleFetchStudents}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="all" pt="md">
                    <StudentDetailPage />
                </Tabs.Panel>
            </Tabs>
        </div>
    );
}

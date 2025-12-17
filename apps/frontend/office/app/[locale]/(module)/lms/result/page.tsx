'use client';
import { Tabs, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ProgramAndCalendarSelector } from '../../school_admin/classes/create/components/programAndCalendar';
import {
    type GetClass,
    fetchClassesApi,
} from '../../school_admin/classes/create/components/schema/fetchClassesDetail';
import { fetchStudentsApi } from '../../school_admin/students/schemas/api';
import type { StudentResponse } from '../../school_admin/students/schemas/type';
import ResultCreate from './component/create-result.tab';
import ResultView from './component/view-result.tab';

export default function ResultPage() {
    const [calendarYearId, setCalendarYearId] = useState<string | null>(null);
    const [programId, setProgramId] = useState<string | null>(null);
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [loading, setLoadingYears] = useState(true);
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
        } catch (error) {
            throw new Error('Failed to fetch students');
        } finally {
            setLoadingStudents(false);
        }
    };

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await fetchClassesApi(calendarYearId ?? '');
                setClasses(data);
            } catch (error) {
                throw new Error('Failed to fetch classes');
            }
        };
        fetchClasses();
    }, [calendarYearId]);

    return (
        <div>
            <ProgramAndCalendarSelector
                onChange={({ programId, calenderYearId, calenderYearName }) => {
                    setProgramId(programId);
                    setCalendarYear(calenderYearName);
                    setCalendarYearId(calenderYearId);
                }}
            />

            <Text size="xl" mb="md">
                Result Page
            </Text>
            <Tabs defaultValue="create">
                <Tabs.List>
                    <Tabs.Tab value="create">Create Result</Tabs.Tab>
                    <Tabs.Tab value="view">View Result</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="create" pt="md">
                    <ResultCreate
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
                    <ResultView
                        programId={programId}
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

'use client';

import { Paper } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSessionStorage } from 'react-use';
import { useActiveSelection } from 'utilities/utilities';
import { StudentControls } from '../../_components/students/student-controls';
import { StudentTable } from '../../_components/students/student-table';
import { ProgramAndCalendarSelector } from '../classes/create/components/programAndCalendar';
import {
    type GetClass,
    fetchClassesApi,
} from '../classes/create/components/schema/fetchClassesDetail';
import { PrintIdModal } from './components/PrintIdModal';
import { fetchStudentsApi } from './schemas/api';
import type { StudentResponse } from './schemas/type';

export default function StudentPage() {
    const [calendarYearId, setCalendarYearId] = useSessionStorage<string | null>('studentList_calendarYearId', null);
    const [programId, setProgramId] = useSessionStorage<string | null>('studentList_programId', null);
    const [calendarYear, setCalendarYear] = useSessionStorage<string | null>('studentList_calendarYear', null);
    const [classes, setClasses] = useSessionStorage<GetClass[]>('studentList_classes', []);
    const [selectedClass, setSelectedClass] = useSessionStorage<string | null>('studentList_selectedClass', null);
    const [selectedSection, setSelectedSection] = useSessionStorage<string | null>('studentList_selectedSection', null);
    const [students, setStudents] = useSessionStorage<StudentResponse[]>('studentList_students', []);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [hasLoadedStudents, setHasLoadedStudents] = useState(false);
    
    // To prevent hydration errors when reading from sessionStorage
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    const router = useRouter();
    const SelectedClassId = useActiveSelection(selectedSection, selectedClass);
    // Function to handle batch printing
    const handleBatchPrint = () => {
        setPrintModalOpen(true);
    };

    const fetchClasses = async (calenderId: string) => {
        if (!calenderId) return;
        setStudents([]);
        setHasLoadedStudents(false);
        setClasses([]);
        setSelectedClass(null);
        try {
            const data = await fetchClassesApi(calenderId ?? '');
            setClasses(data);
        } catch (err) {
            // handle error
        }
    };

    const handleFetchStudents = async () => {
        setStudents([]);
        if (!selectedClass) {
            return;
        }

        try {
            setLoadingStudents(true);
            const data = await fetchStudentsApi(SelectedClassId ?? '');
            setStudents(data);
            setHasLoadedStudents(true);
        } finally {
            setLoadingStudents(false);
        }
    };

    if (!isMounted) return null;

    return (
        <div>
            <ProgramAndCalendarSelector
                defaultProgramId={programId || undefined}
                onChange={({ programId: pId, calenderYearId: cyId, calenderYearName: cyName }) => {
                    setProgramId(pId);
                    setCalendarYear(cyName);
                    
                    // Only fetch classes if calendar year actually changed!
                    if (cyId !== calendarYearId) {
                        setCalendarYearId(cyId);
                        fetchClasses(cyId ?? '');
                    }
                }}
            />

            <Paper shadow="xs" p={{ base: 'md', sm: 'lg' }} radius="md" withBorder>
                <StudentControls
                    classes={classes}
                    selectedClass={selectedClass}
                    selectedSection={selectedSection}
                    studentsCount={students.length}
                    onClassChange={(val) => {
                        setStudents([]);
                        setHasLoadedStudents(false);
                        setSelectedClass(val);
                        setSelectedSection(null);
                    }}
                    onSectionChange={(val) => {
                        setStudents([]);
                        setHasLoadedStudents(false);
                        setSelectedSection(val);
                    }}
                    onLoadStudents={handleFetchStudents}
                    onPrint={handleBatchPrint}
                />

                <StudentTable
                    students={students}
                    loading={loadingStudents}
                    hasLoadedStudents={hasLoadedStudents}
                    hasSelection={!!SelectedClassId}
                    onView={(id) => router.push(`/school_admin/students/${id}`)}
                />
            </Paper>
            <PrintIdModal
                opened={printModalOpen}
                onClose={() => setPrintModalOpen(false)}
                students={students}
            />
        </div>
    );
}

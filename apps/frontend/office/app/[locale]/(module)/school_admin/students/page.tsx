'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
    const [calendarYearId, setCalendarYearId] = useState<string | null>(null);
    const [programId, setProgramId] = useState<string | null>(null);
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [classes, setClasses] = useState<GetClass[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const router = useRouter();
    const SelectedClassId = useActiveSelection(selectedSection, selectedClass);
    // Function to handle batch printing
    const handleBatchPrint = () => {
        setPrintModalOpen(true);
    };

    const fetchClasses = async (calenderId: string) => {
        setStudents([]);
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
        } finally {
            setLoadingStudents(false);
        }
    };

    return (
        <div>
            <ProgramAndCalendarSelector
                onChange={({ programId, calenderYearId, calenderYearName }) => {
                    setProgramId(programId);
                    setCalendarYear(calenderYearName);
                    setCalendarYearId(calenderYearId);
                    fetchClasses(calenderYearId ?? '');
                }}
            />

            <StudentControls
                classes={classes}
                selectedClass={selectedClass}
                selectedSection={selectedSection}
                students={students}
                onClassChange={(val) => {
                    setStudents([]);
                    setSelectedClass(val);
                    setSelectedSection(null);
                }}
                onSectionChange={setSelectedSection}
                onLoadStudents={handleFetchStudents}
                onPrint={handleBatchPrint}
            />

            <StudentTable
                students={students}
                loading={loadingStudents}
                onView={(id) => router.push(`/school_admin/students/${id}`)}
            />
            <PrintIdModal
                opened={printModalOpen}
                onClose={() => setPrintModalOpen(false)}
                students={students}
            />
        </div>
    );
}

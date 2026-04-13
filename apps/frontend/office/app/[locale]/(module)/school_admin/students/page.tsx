'use client';

import { Center, Group, Pagination, Paper, Select } from '@mantine/core';
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
import { fetchStudentsPaginatedApi } from './schemas/api';
import type { StudentResponse } from './schemas/type';

export default function StudentPage() {
    const [calendarYearId, setCalendarYearId] = useSessionStorage<string | null>('studentList_calendarYearId', null);
    const [programId, setProgramId] = useSessionStorage<string | null>('studentList_programId', null);
    const [calendarYear, setCalendarYear] = useSessionStorage<string | null>('studentList_calendarYear', null);
    const [classes, setClasses] = useSessionStorage<GetClass[]>('studentList_classes', []);
    const [selectedClass, setSelectedClass] = useSessionStorage<string | null>('studentList_selectedClass', null);
    const [selectedSection, setSelectedSection] = useSessionStorage<string | null>('studentList_selectedSection', null);
    const [students, setStudents] = useSessionStorage<StudentResponse[]>('studentList_students', []);
    const [activePage, setActivePage] = useSessionStorage<number>('studentList_studentsPage', 1);
    const [limit, setLimit] = useSessionStorage<number>('studentList_studentsLimit', 10);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [hasLoadedStudents, setHasLoadedStudents] = useState(false);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    
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
        setTotalStudents(0);
        setTotalPages(1);
        setActivePage(1);
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

    const handleFetchStudents = async (page = activePage) => {
        if (!SelectedClassId) {
            setStudents([]);
            setTotalStudents(0);
            setTotalPages(1);
            return;
        }

        try {
            setLoadingStudents(true);
            const response = await fetchStudentsPaginatedApi(SelectedClassId, {
                page,
                limit,
            });
            setStudents(response.data ?? []);
            setTotalStudents(response.total ?? 0);
            setTotalPages(
                Math.max(
                    1,
                    Math.ceil(
                        (response.total ?? 0) /
                            Number(response.pp || limit),
                    ),
                ),
            );
            setHasLoadedStudents(true);
        } finally {
            setLoadingStudents(false);
        }
    };

    useEffect(() => {
        if (!hasLoadedStudents || !SelectedClassId) {
            return;
        }

        const refreshStudents = async () => {
            try {
                setLoadingStudents(true);
                const response = await fetchStudentsPaginatedApi(
                    SelectedClassId,
                    {
                        page: activePage,
                        limit,
                    },
                );
                setStudents(response.data ?? []);
                setTotalStudents(response.total ?? 0);
                setTotalPages(
                    Math.max(
                        1,
                        Math.ceil(
                            (response.total ?? 0) /
                                Number(response.pp || limit),
                        ),
                    ),
                );
            } finally {
                setLoadingStudents(false);
            }
        };

        refreshStudents();
    }, [activePage, hasLoadedStudents, SelectedClassId, limit, setStudents]);

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
                    studentsCount={totalStudents}
                    onClassChange={(val) => {
                        setStudents([]);
                        setTotalStudents(0);
                        setTotalPages(1);
                        setActivePage(1);
                        setHasLoadedStudents(false);
                        setSelectedClass(val);
                        setSelectedSection(null);
                    }}
                    onSectionChange={(val) => {
                        setStudents([]);
                        setTotalStudents(0);
                        setTotalPages(1);
                        setActivePage(1);
                        setHasLoadedStudents(false);
                        setSelectedSection(val);
                    }}
                    onLoadStudents={() => {
                        setActivePage(1);
                        handleFetchStudents(1);
                    }}
                    onPrint={handleBatchPrint}
                />

                <StudentTable
                    students={students}
                    loading={loadingStudents}
                    hasLoadedStudents={hasLoadedStudents}
                    hasSelection={!!SelectedClassId}
                    rowOffset={(activePage - 1) * limit}
                    onView={(id) => router.push(`/school_admin/students/${id}`)}
                />

                {hasLoadedStudents && totalPages > 1 ? (
                    <Center mt="md">
                        <Group>
                            <Select
                                value={limit.toString()}
                                data={[
                                    { value: '5', label: '5 / page' },
                                    { value: '10', label: '10 / page' },
                                    { value: '20', label: '20 / page' },
                                    { value: '50', label: '50 / page' },
                                    { value: '100', label: '100 / page' },
                                ]}
                                onChange={(value) => {
                                    if (!value) {
                                        return;
                                    }

                                    setLimit(Number(value));
                                    setActivePage(1);
                                }}
                                w={120}
                                mr="md"
                            />
                            <Pagination
                                value={activePage}
                                onChange={setActivePage}
                                total={totalPages}
                                withEdges
                                siblings={1}
                                boundaries={1}
                                color="rgb(13 64 73)"
                            />
                        </Group>
                    </Center>
                ) : null}
            </Paper>
            <PrintIdModal
                opened={printModalOpen}
                onClose={() => setPrintModalOpen(false)}
                students={students}
            />
        </div>
    );
}

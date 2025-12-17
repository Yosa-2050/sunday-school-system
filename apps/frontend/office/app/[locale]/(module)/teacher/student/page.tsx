import { useState } from 'react';
import { ProgramAndCalendarSelector } from '../../school_admin/classes/create/components/programAndCalendar';
import {
    type GetClass,
    fetchClassesApi,
} from '../../school_admin/classes/create/components/schema/fetchClassesDetail';
import type { StudentResponse } from '../../school_admin/students/schemas/type';

export default function StudentPage() {
    const [calendarYearId, setCalendarYearId] = useState<string | null>(null);
    const [programId, setProgramId] = useState<string | null>(null);
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [classes, setClasses] = useState<GetClass[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);

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
        </div>
    );
}

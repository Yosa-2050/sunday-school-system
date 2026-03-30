import { Group, Loader, Select, Text } from '@mantine/core';
import { useAuth } from '@shega/ui';
import {
    type CalendarYearResponse,
    type ProgramResponse,
    fetchCalendarYearsSchoolAdmin,
    fetchProgramsForOrg,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useEffect, useState } from 'react';

type Props = {
    onChange: (data: {
        programId: string | null;
        calenderYearName: string | null;
        calenderYearId: string | null;
    }) => void;
    defaultProgramId?: string | null;
};

export function ProgramAndCalendarSelector({ onChange, defaultProgramId }: Props) {
    const [programs, setPrograms] = useState<ProgramResponse[]>([]);
    const [calendarYears, setCalendarYears] = useState<CalendarYearResponse[]>(
        [],
    );
    const [loadingYears, setLoadingYears] = useState(true);

    const [programId, setProgramId] = useState<string | null>(null);
    const [calenderYearName, setCalenderYearName] = useState<string | null>(
        null,
    );
    const [calendarYearId, setCalendarYearId] = useState<string | null>(null);

    const user = useAuth();

    useEffect(() => {
        const load = async () => {
            setLoadingYears(true);
            const data = await fetchProgramsForOrg();
            setPrograms(data);
            
            if (defaultProgramId && data.some(p => p.id === defaultProgramId)) {
                setProgramId(defaultProgramId);
                loadCalendarYears(defaultProgramId);
            } else {
                setLoadingYears(false);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultProgramId]);

    const loadCalendarYears = async (id: string) => {
        setCalenderYearName(null);
        setCalendarYearId(null);
        setLoadingYears(false);
        const data = await fetchCalendarYearsSchoolAdmin(id);
        setCalendarYears(data);

        const active = data.find((y) => y.isActive);

        setCalenderYearName(active?.name ?? '');
        setCalendarYearId(active?.id ?? '');

        onChange({
            programId: id,
            calenderYearName: active?.name ?? '',
            calenderYearId: active?.id ?? '',
        });

        setLoadingYears(false);
    };
    return (
        <Group mb="md">
            <Text fw={500}>Programs:</Text>
            <Select
                value={programId}
                data={programs.map((p) => ({
                    value: p.id,
                    label: p.name,
                }))}
                onChange={(val) => {
                    setProgramId(val);
                    setCalenderYearName(null);
                    setCalendarYearId(null);

                    loadCalendarYears(val ?? '');
                }}
            />
            <Text fw={500}>Calendar Year:</Text>

            {loadingYears ? (
                <Loader size="sm" />
            ) : (
                <Select
                    value={calenderYearName}
                    data={[calenderYearName || '']}
                    disabled
                />
            )}
        </Group>
    );
}

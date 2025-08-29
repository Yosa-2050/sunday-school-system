import { fetcher } from '@shega/shared';

export const fetchPrograms = async (
    //payload: string,
): Promise<ProgramResponse[]> => {
    const response: ProgramResponse[] = await fetcher('/lms/program', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        //body: JSON.stringify({ q: payload }),
    });

    return response;
};

export const fetchCalendarYears = async (
    id: string,
): Promise<ProgramResponse[]> => {
    const response: ProgramResponse[] = await fetcher(
        `/lms/calendarYear/${id}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            //body: JSON.stringify({ q: payload }),
        },
    );

    return response;
};

export const fetchCRootClasses = async (
    id: string,
): Promise<ProgramResponse[]> => {
    const response: ProgramResponse[] = await fetcher(`/class/root/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        //body: JSON.stringify({ q: payload }),
    });

    return response;
};

export const fetchProgramsById = async (
    mentorshipId: string,
): Promise<ProgramResponse> => {
    const response: ProgramResponse = await fetcher(
        `/lms/program/${mentorshipId}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        },
    );

    return response;
};

export const createCalendarYear = async (programId: string) => {
    const res = await fetch(`/api/programs/${programId}/calendar-year`, {
        method: 'POST',
    });
    if (!res.ok) {
        throw new Error('Failed to create calendar year');
    }
    return res.json();
};

export const createRootClass = async (programId: string) => {
    const res = await fetch(
        `/api/programs/${programId}/calendar-year/root-classes`,
        {
            method: 'POST',
        },
    );
    if (!res.ok) {
        throw new Error('Failed to create root class');
    }
    return res.json();
};

export type ProgramResponse = {
    id: string;
    createdAt: string;
    createdBy: string;
    isActive: boolean;
    name: string;
};

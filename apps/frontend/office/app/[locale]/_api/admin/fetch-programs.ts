import { fetcher } from '@shega/shared';

export const fetchPrograms = async (): Promise<ProgramResponse[]> => {
    const response: ProgramResponse[] = await fetcher('/lms/program', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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

export const createCalendarYear = async (
    programId: string,
    data: CreateProgram,
) => {
    const res: IdSuccessResponse = await fetcher(
        `/lms/calendarYear/${programId}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        },
    );
    if (!res) {
        throw new Error('Failed to create calendar year');
    }
    return res;
};

export const createRootClass = async (programId: string, text: string) => {
    const res: IdSuccessResponse = await fetcher(`/class/root/${programId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    if (!res) {
        throw new Error('Failed to create calendar year');
    }
    return res;
};

export type ProgramResponse = {
    id: string;
    createdAt: string;
    createdBy: string;
    isActive: boolean;
    name: string;
};

export type IdSuccessResponse = {
    id: string;
};

export type CreateProgram = {
    name: string;
    startDate: Date;
    endDate: Date;
};

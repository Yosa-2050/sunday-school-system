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
): Promise<CalendarYearResponse[]> => {
    const response: CalendarYearResponse[] = await fetcher(
        `/lms/calendarYear/${id}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            //body: JSON.stringify({ q: payload }),
        },
    );

    return response;
};

export const fetchCalendarYearsSchoolAdmin = async (): Promise<
    CalendarYearResponse[]
> => {
    const response: CalendarYearResponse[] = await fetcher(
        '/lms/calendarYear',
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        },
    );

    return response;
};

export const fetchRootClasses = async (
    id?: string,
): Promise<ProgramResponse[]> => {
    const url = id ? `/class/root/${id}` : '/class/root';
    const response: ProgramResponse[] = await fetcher(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        //body: JSON.stringify({ q: payload }),
    });

    return response;
};

export const fetchUsers = async (
    id: string,
): Promise<ProgramUserResponse[]> => {
    const response: ProgramUserResponse[] = await fetcher(`/lms/users/${id}`, {
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

export const createUser = async (programId: string, data: CreateUserType) => {
    const res: IdSuccessResponse = await fetcher(`/lms/user/${programId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
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

export type CalendarYearResponse = {
    id: string;
    createdAt: string;
    createdBy: string;
    isActive: boolean;
    name: string;
    startDate: string;
    endDate: string;
};

export type ProgramUserResponse = {
    id: string;
    createdAt: string;
    createdBy: string;
    isActive: boolean;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
};

export type IdSuccessResponse = {
    id: string;
};

export type SuccessResponse = {
    status: boolean;
};

export type CreateProgram = {
    name: string;
    startDate: Date;
    endDate: Date;
};

export type CreateUserType = {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
};

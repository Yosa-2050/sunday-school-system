import { fetcher } from '@shega/shared';

export const fetchPrograms = async (
    organizationId: string,
): Promise<ProgramResponse[]> => {
    const response: ProgramResponse[] = await fetcher(
        `/lms/program/byOrganization/${organizationId}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        },
    );

    return response;
};

export const fetchProgramsForOrg = async (): Promise<ProgramResponse[]> => {
    const response: ProgramResponse[] = await fetcher(
        '/lms/program/ForOrganization',
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        },
    );

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
        },
    );

    return response;
};

export const fetchCalendarYearsSchoolAdmin = async (
    programId: string,
): Promise<CalendarYearResponse[]> => {
    const response: CalendarYearResponse[] = await fetcher(
        `/lms/calendarYearForOrg/${programId}`,
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

export const fetchRootClassesSchoolAdmin = async (
    id?: string,
): Promise<ProgramResponse[]> => {
    const url = id ? `/class/rootForOrg/${id}` : '/class/root';
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
    programId: string,
): Promise<ProgramResponse> => {
    const response: ProgramResponse = await fetcher(
        `/lms/program/${programId}`,
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
        throw new Error('Failed to create program year');
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

//new function for the createprogram
export const createProgram = async (
    data: CreateProgram,
    organizationId: string | null,
) => {
    const res: IdSuccessResponse = await fetcher(
        `/lms/program/${organizationId}`,
        {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        },
    );
    if (!res) {
        throw new Error('Failed to create program');
    }
    return res;
};

export const updateProgramApi = async (
    data: CreateProgram,
    programId: string,
) => {
    const res: SuccessResponse = await fetcher(`/lms/program/${programId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res) {
        throw new Error('Failed to update program');
    }
    return res;
};

export const deleteProgramApi = async (programId: string) => {
    const res: SuccessResponse = await fetcher(`/lms/program/${programId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res) {
        throw new Error('Failed to delete program');
    }

    return res;
};

export type ProgramResponse = {
    id: string;
    createdAt: string;
    createdBy: string;
    isActive: boolean;
    name: string;
    programType?: 'SS1_12' | 'SS_Course';
    description: string;
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
    programType?: 'SS1_12' | 'SS_Course';
    description: string;
};

export type CreateUserType = {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
};

import { fetcher } from '@shega/shared';
import type { IdSuccessResponse } from 'app/[locale]/_api/admin/fetch-programs';

export type SectionField = { name: string };

export type CreateClass = {
    name: string;
    description: string;
    rootId: string;
    section: SectionField[]; // must be an array of objects if you want dynamic fields
};

export type GetClass = {
    id: string;
    name: string;
    isActive: boolean;
    hasSection: boolean;
    root: GetRootClass;
    sections?: GetClass[];
};

export type GetRootClass = {
    id: string;
    name: string;
};
export const createClass = async (data: CreateClass) => {
    const res: IdSuccessResponse = await fetcher('/class/main', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res) {
        throw new Error('Failed to create class');
    }
    return res;
};

export const fetchClassesApi = async (): Promise<GetClass[]> => {
    const response: GetClass[] = await fetcher('/class/main', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

import { fetcher } from '@shega/shared';
import type { IdSuccessResponse } from 'app/[locale]/_api/admin/fetch-programs';
import type { CreateDepartment, DepartmentResponse } from './type';

export const fetchDepartmentsApi = async (): Promise<DepartmentResponse[]> => {
    const response: DepartmentResponse[] = await fetcher('/department', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

export const createDepartmentApi = async (
    body: CreateDepartment,
): Promise<IdSuccessResponse> => {
    const response: IdSuccessResponse = await fetcher('/department', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    return response;
};

export const fetchDepartmentById = async (
    id: string,
): Promise<DepartmentResponse> => {
    const response: DepartmentResponse = await fetcher(`/department/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

export const updateDepartmentApi = async (
    id: string,
    body: CreateDepartment,
): Promise<IdSuccessResponse> => {
    const response: IdSuccessResponse = await fetcher(`/department/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    return response;
};

export const DeleteDepartmentApi = async (id: string) => {
    const response = await fetcher(`/department/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

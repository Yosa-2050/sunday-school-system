import { fetcher } from '@shega/shared';
import type { IdSuccessResponse } from 'app/[locale]/_api/admin/fetch-programs';
import type { AssignMemberList, DepartmentMemberResponse } from './type';

export const AssignDepartmentMemberApi = async (
    assignMemberList: AssignMemberList,
): Promise<IdSuccessResponse> => {
    const response = await fetcher<IdSuccessResponse>('/departmentMember', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignMemberList),
    });
    return response;
};

export const fetchDepartmentMembersByDepartmentIdApi = async (
    departmentId: string,
): Promise<AssignMemberList[]> => {
    const response = await fetcher<AssignMemberList[]>(
        `/departmentMember/id/${departmentId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return response;
};

export const fetchDepartmentsApi = async (): Promise<
    DepartmentMemberResponse[]
> => {
    const response = await fetcher<DepartmentMemberResponse[]>('/department', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response;
};

export const fetchAssignedMembersByDepartment = async (
    departmentId: string,
    subDepartmentId?: string,
): Promise<DepartmentMemberResponse> => {
    const subUrl = subDepartmentId ? `&subDepartmentId=${subDepartmentId}` : '';
    const response = await fetcher<DepartmentMemberResponse>(
        `/departmentMember?departmentId=${departmentId}${subUrl}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return response;
};

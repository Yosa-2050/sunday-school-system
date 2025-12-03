import { fetcher } from '@shega/shared';
import type { StudentByIdResponse } from 'app/[locale]/(module)/school_admin/students/schemas/type';
import type {
    CreateMemberRequest,
    CreateRelationRequest,
    OrganizationMemberList,
} from './type';

export const CreateMemberApi = async (
    formdata: CreateMemberRequest,
    relationFormData: CreateRelationRequest,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Promise<any> => {
    const payLoad = {
        ...formdata,
        ...relationFormData,
    };
    const response = await fetcher('/organization-member/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payLoad),
    });
    return response;
};

export const fetchMembersApi = async (): Promise<OrganizationMemberList[]> => {
    const response = await fetcher<OrganizationMemberList[]>(
        '/organization-member/member-list',
        {
            method: 'GET',
        },
    );

    return response;
};

//TODO: will change the StudentByIdResponse bc it's student's will make it members on the type
export const fetchMembersIdApi = async (
    memberId: string,
): Promise<StudentByIdResponse> => {
    const url = `/organization-member/${memberId}`;
    const response: StudentByIdResponse = await fetcher(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return response;
};

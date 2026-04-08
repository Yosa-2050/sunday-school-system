import { fetcher } from '@shega/shared';
import type { ProgramUser } from 'app/[locale]/_api/users/fetch-user';
import type {
    CreateHomeRoom,
    HomeroomAssignment,
    UpdateHomeRoom,
} from './type';
import { OrganizationMemberList, PaginatedResponse } from 'app/[locale]/(module)/admin/members/schemas/type';

export const CreateHomeRoomApi = async (
    body: CreateHomeRoom,
): Promise<ProgramUser[]> => {
    const response: ProgramUser[] = await fetcher('/home-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    return response;
};

export const findClassesByCalendarId = async (
    yearId: string,
): Promise<HomeroomAssignment[]> => {
    const response: HomeroomAssignment[] = await fetcher(
        `/home-room/byCalendarId/${yearId}`,
    );
    return response;
};

export const getUsers = async (programId: string): Promise<ProgramUser[]> => {
    const response: ProgramUser[] = await fetcher(`/lms/users/${programId}`);
    return response;
};

export const updateHomeRoomApi = async (
    body: UpdateHomeRoom,
): Promise<HomeroomAssignment> => {
    const response: HomeroomAssignment = await fetcher('/home-room', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    return response;
};

export const fetchMembersApi = async (
  page: number,
  limit: number,
  search? : string,
  status?: string
): Promise<PaginatedResponse<OrganizationMemberList>> => {
  const response = await 
  fetcher<PaginatedResponse<OrganizationMemberList>>('/organization-member/member-list',
     {
    method: 'POST',
     body: JSON.stringify({
      page,
      limit,
      search,
      status
    })
    
  });

  return response;
};

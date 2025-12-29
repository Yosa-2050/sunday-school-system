import { fetcher } from '@shega/shared';
import type { IdSuccessResponse } from 'app/[locale]/_api/admin/fetch-programs';
import type { TeacherResponse } from './type';

export const fetchTeacherApi = async (
    calendarYearId: string,
): Promise<TeacherResponse[]> => {
    const response: TeacherResponse[] = await fetcher(
        `/teacher?calendarYearId=${calendarYearId}`,
    );
    return response;
};

export const createTeacherApi = async ({
    calendarYearId,
    memberIds,
}: {
    calendarYearId: string;
    memberIds: string[];
}): Promise<IdSuccessResponse> => {
    return await fetcher('/teacher/assign', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            calendarYearId,
            memberIds,
        }),
    });
};

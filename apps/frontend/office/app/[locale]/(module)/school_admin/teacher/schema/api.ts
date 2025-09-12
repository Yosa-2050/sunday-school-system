import { fetcher } from '@shega/shared';
import type { TeacherResponse } from './type';

export const fetchTeacherApi = async (): Promise<TeacherResponse[]> => {
    const response: TeacherResponse[] = await fetcher('/subject/root');
    return response;
};

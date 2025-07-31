import { fetcher } from '@shega/shared';

export const deleteSkill = async (id: string) => {
    const response = await fetcher(`/job-detail/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

export const deleteCatrgoriesData = async (id: string) => {
    const response = await fetcher(`/job-detail/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};

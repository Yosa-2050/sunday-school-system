import { fetcher } from '@shega/shared';

export const editSkills = async (id: string, name: string) => {
    const response = await fetcher(`/job-detail/skills/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
        }),
    });

    return response;
};

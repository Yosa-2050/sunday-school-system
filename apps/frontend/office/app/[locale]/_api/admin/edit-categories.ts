import { fetcher } from '@shega/shared';

export const editCategories = async (id: string, name: string) => {
    const response = await fetcher(`/job-detail/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
        }),
    });

    return response;
};

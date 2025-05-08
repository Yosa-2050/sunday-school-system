import { fetcher } from '@shega/shared';

export const getCategoriesById = async (id: string) => {
    const response = await fetcher(`/job-detail/categoriesById/${id}`, {
        method: 'GET',
    });

    return response as { name: string };
};

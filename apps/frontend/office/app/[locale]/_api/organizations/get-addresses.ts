import { fetcher } from '@shega/shared';

export const getAddressById = async (id: string) => {
    const response = await fetcher(`/location/${id}`, {
        method: 'GET',
    });

    return response as { name: string };
};

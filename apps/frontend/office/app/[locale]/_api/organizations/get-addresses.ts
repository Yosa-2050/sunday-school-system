import { fetcher } from '@shega/shared';

export const getAddressById = async (id: string) => {
    const response = await fetcher(`/address/${id}`, {
        method: 'GET',
    });

    return response as { name: string };
};

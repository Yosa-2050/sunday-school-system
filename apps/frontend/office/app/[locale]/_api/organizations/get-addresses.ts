import { fetcher } from '@shega/shared';

export const getAddressById = async (id: string) => {
    const response = await fetcher(`/location/${id}`, {
        method: 'GET',
    });

    return response as { name: string };
};
export const getCountryById = async (id: string) => {
    const response = await fetcher(`/address/country/${id}`, {
        method: 'GET',
    });

    return response as { name: string };
};

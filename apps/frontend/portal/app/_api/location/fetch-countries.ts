import { fetcher } from '@shega/shared';

export const fetchCountries = async () => {
    const response = await fetcher('/location/countries', {
        method: 'GET',
        headers: { accept: '*/*' },
    });
    if (!response) {
        throw new Error('Failed to fetch countries');
    }
    return response as { id: string; name: string; code: string }[];
};

export const fetchCities = async (code: string) => {
    if (!code) {
        throw new Error('Region ID cannot be empty');
    }
    const response = await fetcher(`/location/locationByCountry/${code}/CITY`, {
        method: 'GET',
        headers: { accept: '*/*' },
    });
    return response as
        | { id: string; name: string; isActive: boolean }[]
        | undefined;
};

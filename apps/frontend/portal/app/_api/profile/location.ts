import { fetcher } from '@shega/shared';
import { useQuery } from '@tanstack/react-query';

// Types
export type Country = {
    id: string;
    name: string;
    code: string;
};

export type Region = {
    id: string;
    name: string;
    isActive: boolean;
    type: string;
    isRoot: boolean;
    hasChild: boolean;
};

export type City = {
    id: string;
    name: string;
    isActive: boolean;
};

export type EnumValue = {
    key: string;
    value: string;
};

// API functions
export const fetchCountries = async (): Promise<Country[]> => {
    const response = await fetcher<Country[]>('/location/countries', {
        method: 'GET',
        headers: { accept: '*/*' },
    });

    if (!response) {
        throw new Error('Failed to fetch countries');
    }

    return response;
};

export const fetchRegions = async (countryCode: string): Promise<Region[]> => {
    if (!countryCode) {
        throw new Error('Country code cannot be empty');
    }

    const response = await fetcher<Region[]>(
        `/location/locationByCountry/${countryCode}/REGION`,
        {
            method: 'GET',
            headers: { accept: '*/*' },
        },
    );

    return response;
};

export const fetchCities = async (regionId: string): Promise<City[]> => {
    if (!regionId) {
        throw new Error('Region ID cannot be empty');
    }

    const response = await fetcher<City[]>(
        `/location/locationByParentId/${regionId}`,
        {
            method: 'GET',
            headers: { accept: '*/*' },
        },
    );

    return response || [];
};

export const fetchEnum = async (
    enumType: 'EmploymentType' | 'WorkPlaceType',
): Promise<EnumValue[]> => {
    if (!enumType) {
        throw new Error('Enum type cannot be empty');
    }

    const response = await fetcher<{ data: Record<string, string> }>(
        `/enums/${enumType}`,
        {
            method: 'GET',
            headers: { accept: '*/*' },
        },
    );

    // Convert the response to the expected format
    return Object.entries(response.data).map(([key, value]) => ({
        key,
        value,
    }));
};

// React Query hooks
export const useCountries = () => {
    return useQuery({
        queryKey: ['countries'],
        queryFn: fetchCountries,
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
    });
};

export const useRegions = (countryCode: string) => {
    return useQuery({
        queryKey: ['regions', countryCode],
        queryFn: () => fetchRegions(countryCode),
        enabled: !!countryCode,
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
    });
};

export const useCities = (regionId: string) => {
    return useQuery({
        queryKey: ['cities', regionId],
        queryFn: () => fetchCities(regionId),
        enabled: !!regionId,
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
    });
};

export const useEmploymentTypes = () => {
    return useQuery({
        queryKey: ['employmentTypes'],
        queryFn: () => fetchEnum('EmploymentType'),
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
    });
};

export const useWorkplaceTypes = () => {
    return useQuery({
        queryKey: ['workplaceTypes'],
        queryFn: () => fetchEnum('WorkPlaceType'),
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
    });
};

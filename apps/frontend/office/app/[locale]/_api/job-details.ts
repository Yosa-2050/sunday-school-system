import { fetcher } from '@shega/shared';

export const fetchSkills = async () => {
    const response = await fetcher('/job-detail/skills', {
        method: 'GET',
        headers: { accept: '*/*' },
    });
    return response as { id: string; name: string; isActive: boolean }[];
};

export const fetchCategories = async () => {
    const response = await fetcher('/job-detail/categories', {
        method: 'GET',
        headers: { accept: '*/*' },
    });
    return response as {
        id: string;
        isActive: boolean;
        name: string;
        type: string;
        isRoot: boolean;
        hasChild: boolean;
    }[];
};
export const deleteCategory = async () => {
    const response = await fetcher('/job-detail/categories', {
        method: 'DELETE',
        headers: { accept: '*/*' },
    });
    return response;
};
export const addCategory = async (payload: {
    name: string;
    isActive: boolean;
}) => {
    const response = await fetcher('/job-detail/categories', {
        method: 'POST',
        headers: { accept: '*/*' },
        body: JSON.stringify(payload),
    });
    return response;
};
export const addRegion = async (payload: {
    list: string[];
    countryId: string;
    parentId: string | null;
    type: string;
}) => {
    const response = await fetcher('/location', {
        method: 'POST',
        headers: { accept: '*/*' },
        body: JSON.stringify({
            ...payload,
            parentId: payload.type === 'REGION' ? null : payload.parentId,
        }),
    });
    return response;
};
export const addSkills = async (payload: {
    name: string;
    isActive: boolean;
}) => {
    const response = await fetcher('/job-detail/skills', {
        method: 'POST',
        headers: { accept: '*/*' },
        body: JSON.stringify(payload),
    });
    return response;
};

export const fetchRegions = async (countryCode: string) => {
    if (!countryCode) {
        throw new Error('Country code cannot be empty');
    }
    const response: {
        id: string;
        isActive: boolean;
        name: string;
        type: string;
        isRoot: boolean;
        hasChild: boolean;
    }[] = await fetcher(`/location/locationByCountry/${countryCode}/REGION`, {
        method: 'GET',
        headers: { accept: '*/*' },
    });
    return response as {
        id: string;
        isActive: boolean;
        name: string;
        type: string;
        isRoot: boolean;
        hasChild: boolean;
    }[];
};

export const fetchRegionsId = async (countryid: string) => {
    if (!countryid) {
        throw new Error('Country code cannot be empty');
    }
    const response: {
        id: string;
        isActive: boolean;
        name: string;
        type: string;
        isRoot: boolean;
        hasChild: boolean;
    }[] = await fetcher(`/location/locationByCountryId/${countryid}/REGION`, {
        method: 'GET',
        headers: { accept: '*/*' },
    });
    return response as {
        id: string;
        isActive: boolean;
        name: string;
        type: string;
        isRoot: boolean;
        hasChild: boolean;
    }[];
};

export const fetchCities = async (regionId: string) => {
    if (!regionId) {
        throw new Error('Region ID cannot be empty');
    }
    const response = await fetcher(`/location/locationByParentId/${regionId}`, {
        method: 'GET',
        headers: { accept: '*/*' },
    });
    return response as
        | { id: string; name: string; isActive: boolean }[]
        | undefined;
};

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

export const fetchlocationById = async (id: string) => {
    const response = await fetcher(`/location/${id}`, {
        method: 'GET',
        headers: { accept: '*/*' },
    });
    return response as {
        id: string;
        isActive: boolean;
        name: string;
        type: string;
        isRoot: boolean;
        hasChild: boolean;
    };
};

export const fetchSalaryFrequencyType = async () => {
    const response = await fetcher('/work-frequency-type', {
        method: 'GET',
        headers: { accept: '*/*' },
    });
    if (!response) {
        throw new Error('Failed to fetch salary frequency types');
    }
    return response;
};

export const fetchEducationalRequirmentType = async () => {
    const response = await fetcher('/educational-requirement-type', {
        method: 'GET',
        headers: { accept: '*/*' },
    });
    if (!response) {
        throw new Error('Failed to fetch educational requirement types');
    }
    return response;
};

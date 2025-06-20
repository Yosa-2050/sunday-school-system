import { fetcher } from '@shega/shared';

export interface Category {
    id: string;
    name: string;
}

export interface Contact {
    id?: string;
    value: string;
    type?: string | undefined;
    isPreferred?: boolean;
}

export interface LocationData {
    [key: string]: string;
    country: string;
    region: string;
    subcity: string;
    city: string;
    woreda: string;
    houseNumber: string;
}

export interface Organization {
    displayName: string;
    registrationNumber: string;
    type: string;
    sectorId: string;
    sector?: Category;
    yearFounded: number;
    companySize: string;
    description: string;
    logoUrl?: string;
    contacts?: Contact[];
    locations?: Array<{
        locationData: LocationData;
    }>;
}

export const getOrganizationById = async (id: string) => {
    const response = await fetcher(`/organization/${id}`, {
        method: 'GET',
    });

    return response as Organization;
};

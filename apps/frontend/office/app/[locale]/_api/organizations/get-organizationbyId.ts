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
    corporateEmail: string;
    type: string;
    industryId: string;
    status: string;
    sector?: Category;
    isActive: string;
    yearFounded: string;
    companySize: string;
    description: string;
    logo?: string;
    contacts?: Contact[];
    name: string;
    industry?: {
        id: string;
        createdBy: string;
        createdAt: string;
        isActive: boolean;
        code: string;
        value: string;
        description: string;
        group: string;
        subGroup: string;
    };
    locations?: { locationData: LocationData };
    notes: {
        id: string;
        createdBy: string;
        createdAt: string;
        isActive: boolean;
        reference: string;
        type: string;
        note: string;
    }[];
    __employee__: any;
}

export const getOrganizationById = async (id: string) => {
    const response = await fetcher(`/organization/${id}`, {
        method: 'GET',
    });

    return response as Organization;
};

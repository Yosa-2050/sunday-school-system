import { fetcher } from '@shega/shared';

interface UpdateOrganizationPayload {
    registrationNumber: string;
    description: string;
    displayName: string;
    type: string;
    sectorId: string;
    yearFounded: number;
    companySize: string;
}

export const updateOrganization = async (
    id: string,
    data: Partial<UpdateOrganizationPayload>,
) => {
    const response = await fetcher(`/organization/companyDetail/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response as { success: boolean; message?: string };
};

export type UpdateLocationPayload = {
    country: string;
    region: string;
    subcity: string;
    city: string;
    woreda: string;
    houseNumber: string;
    village?: string;
    addressType?: string;
    addressText?: string;
    latitude?: string;
    longitude?: string;
    isPreferred: true;
};

export const updateLocation = async (
    organizationId: string,
    data: UpdateLocationPayload,
) => {
    const response = await fetcher(
        `/address/location/${organizationId}/organization`,
        {
            method: 'POST',
            body: JSON.stringify({ location: [data] }),
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    return response as { success: boolean; message?: string };
};

export const updateContactInfo = async (
    organizationId: string,
    payload: Partial<{
        phoneNumbers: { value: string; isPreferred: boolean; type: string }[];
        emailAddress: { value: string; isPreferred: boolean; type: string }[];
        otherAddress: { value: string; isPreferred: boolean; type: string }[];
    }>,
) => {
    const response = await fetcher(
        `/address/contacts/${organizationId}/organization`,
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    return response as { success: boolean; message?: string };
};

import { fetcher } from '@shega/shared';
import type { ContactFormData } from 'app/[locale]/(module)/work-provider/profile/components/ContactFormDrawer';
import type { LocationFormData } from 'app/[locale]/(module)/work-provider/profile/components/LocationDetails';

interface UpdateOrganizationPayload {
    registrationNumber: string;
    description: string;
    displayName: string;
    type: string;
    sectorId: string;
    yearFounded: number;
    companySize: string;
    businessAddress: string;
    contactPersonName: string;
    contactPersonRole: string;
    contactPersonPhone: string;
    contactPersonEmail: string;
    companyWebsite?: string;
    companyPhone: string;
    companyEmail: string;
    additionalAddress?: string;
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
    data: LocationFormData,
) => {
    const response = await fetcher(`/address/location/${organizationId}`, {
        method: 'PATCH',
        body: JSON.stringify({
            ...data,
            addressType: 'Other',
            isPreferred: true,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response as { success: boolean; message?: string };
};

export const updateContactInfo = async (
    organizationId: string,
    data: ContactFormData & { additionalAddress?: string },
) => {
    const grouped = {
        phoneNumbers: {
            type: 'Phone',
            value: data.contactPersonPhone,
            isPreferred: true,
        },
        emailAddress: {
            type: 'Communication',
            value: data.contactPersonEmail,
            isPreferred: true,
        },
        otherAddress: {
            type: 'Other',
            value: data.additionalAddress || '',
            isPreferred: false,
        },
    };

    const response = await fetcher(
        `/address/contacts/${organizationId}/Organization`,
        {
            method: 'POST',
            body: JSON.stringify(grouped),
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    return response as { success: boolean; message?: string };
};

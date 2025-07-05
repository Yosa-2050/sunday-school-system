import { fetcher } from '@shega/shared';
import type { DocumentData } from 'app/[locale]/(module)/work-provider/profile/components/UploadFile';

export const getDocumentType = async () => {
    const response = await fetcher(
        '/lookup/DocumentType/OrganizationDocuments',
        {
            method: 'GET',
        },
    );

    return response as Array<{ code: string; value: string }>;
};

export const getDocumentById = async (id: string) => {
    const response = await fetcher(`/document/reference/${id}`, {
        method: 'GET',
    });

    return response as DocumentData;
};

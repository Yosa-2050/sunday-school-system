import { fetcher } from '@shega/shared';
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
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const response: any = await fetcher(`/document/reference/${id}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch document');
    }
    return response.blob();
};

export const getOrganizationDocumentsById = async (orgId: string) => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const response: any = await fetcher(`/document/reference/${orgId}`, {
        method: 'GET',
    });

    return response;
};

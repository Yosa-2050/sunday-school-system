export const IDocumentInterface = Symbol('IDocumentService');

export interface IDocumentService {
    upload(content: string): Promise<string>;
    download(reference: string): string;
}

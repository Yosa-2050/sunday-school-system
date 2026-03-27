import { Express } from 'express';

export const IDocumentInterface = Symbol('IDocumentService');

export interface IDocumentService {
    upload(file: Express.Multer.File): Promise<string>;
    download(reference: string): Promise<Uint8Array>;
}

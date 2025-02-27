// biome-ignore lint/style/useImportType: <explanation>
import { Express } from 'express';
export class CreateDocumentDto {
    file: Express.Multer.File;
}

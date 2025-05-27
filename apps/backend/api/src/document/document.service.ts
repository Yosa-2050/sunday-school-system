// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { Readable } from 'stream';
import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { stringify } from 'csv-stringify';
// biome-ignore lint/style/useImportType: <explanation>
import { Express, Response } from 'express';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';
// biome-ignore lint/style/useImportType: <explanation>
import {
    IDocumentInterface,
    IDocumentService,
} from './interface/document-service.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { DocumentType } from './enums/document-type.enums';

@Injectable()
export class DocumentService {
    constructor(
        @InjectRepository(Document) private repo: Repository<Document>,
        @Inject(IDocumentInterface)
        private readonly documentService: IDocumentService,
    ) {}

    async create(file: Express.Multer.File, referenceId: string, docType?: DocumentType) {
        const file_location = await this.documentService.upload(file);

        const document = this.repo.create({
            fileName: file.originalname,
            fileType: file.mimetype,
            filePath: file_location,
            fileSize: file.size,
            referenceId,
            docType
        });

        const doc = await this.repo.save(document);
        return doc.id;
    }

    findAll() {
        throw new NotImplementedException();
    }

    async findOne(id: string) {
        const doc = await this.repo.findOneBy({ id });
        if (doc) {
            //return doc.filePath;
            const file = await this.documentService.download(doc.filePath);
            return { doc, file };
        }
        throw new EntityNotFoundException('Document');
    }

    findDocumentsByReferenceId(referenceId: string): Promise<Document[]> {
        return this.repo.find({ where: { referenceId } });
    }

    update(id: string, updateDocumentDto: UpdateDocumentDto) {
        return `This action updates a #${id} document`;
    }

    remove(id: number) {
        return `This action removes a #${id} document`;
    }

    convertFileToBase64(file: Express.Multer.File): string {
        try {
            if (!file.buffer) {
                throw new Error(
                    'File buffer is empty. Ensure Multer is configured correctly.',
                );
            }

            // Convert the file buffer to Base64
            const base64String = file.buffer.toString('base64');

            // Include MIME type in Base64 string for compatibility
            const mimeType = file.mimetype; // Example: 'application/pdf' or 'image/jpeg'
            return `data:${mimeType};base64,${base64String}`;
        } catch (error) {
            //TODO: handle error
        }
    }

    generateCsv<T>(data: T[], res: Response, fileName: string) {
        // Create a stream to write the CSV data
        const stringifier = stringify({
            header: true,
            columns: Object.keys(data[0] || {}), // Dynamically get column names from the first object
        });

        // Convert the list of data into a readable stream
        const readableStream = Readable.from(data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${fileName}.csv"`,
        );

        // Pipe the readable stream to the CSV stringifier and then to the response
        readableStream
            .pipe(stringifier)
            .pipe(res as unknown as NodeJS.WritableStream);
    }
}

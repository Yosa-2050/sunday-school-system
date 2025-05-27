import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { DocumentType } from '../enums/document-type.enums';

@Entity()
export class Document extends BaseModel {
    @Column()
    fileName: string;

    @Column()
    filePath: string;

    @Column()
    fileType: string;

    @Column()
    fileSize: number;

    @Column()
    referenceId: string;

    @Column({ nullable: true })
    docType: DocumentType;
}

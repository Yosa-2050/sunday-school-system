import { BaseModel } from 'src/Utilities/entities/base-model.entity';
import { Column, Entity } from 'typeorm';

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
}

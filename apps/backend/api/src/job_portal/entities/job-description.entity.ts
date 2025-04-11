import { Column, Entity, ManyToOne } from 'typeorm';
import { Jobs } from './jobs.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { JobDescriptionType } from '../enums/job-description-type.enum';
import { BaseModel } from '@shega/Utilities/entities/base-model.entity';

@Entity()
export class JobDescription extends BaseModel {
    @ManyToOne(() => Jobs, {
        nullable: false,
    })
    job: Jobs;

    @Column()
    descripiton: string;

    @Column()
    type: JobDescriptionType;
}

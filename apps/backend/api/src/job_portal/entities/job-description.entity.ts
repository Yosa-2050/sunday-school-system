import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { JobDescriptionType } from '../enums/job-description-type.enum';
import { Jobs } from './jobs.entity';

@Entity()
export class JobDescription extends BaseModel {
    @ManyToOne(() => Jobs, {
        nullable: false,
    })
    job: Jobs;

    @Column()
    description: string;

    @Column()
    type: JobDescriptionType;
}

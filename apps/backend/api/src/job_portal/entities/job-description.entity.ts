import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { JobDescriptionType } from '../enums/job-description-type.enum';
import { Programs } from './programs.entity';

@Entity()
export class ProgramDescription extends BaseModel {
    @ManyToOne(() => Programs, {
        nullable: false,
    })
    program: Programs;

    @Column()
    description: string;

    @Column()
    type: JobDescriptionType;
}

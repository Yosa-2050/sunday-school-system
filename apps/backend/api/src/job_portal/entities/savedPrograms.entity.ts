import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Applicants } from './applicants.entity';
import { Programs } from './programs.entity';

@Entity()
export class SavedPrograms extends BaseModel {
    @ManyToOne(
        () => Programs,
        (program) => program.applications,
        { onDelete: 'CASCADE', eager: true },
    )
    program: Programs;

    @ManyToOne(
        () => Applicants,
        (app) => app.applications,
        { onDelete: 'CASCADE', eager: true },
    )
    applicant: Applicants;
}

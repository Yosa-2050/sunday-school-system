import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm';
import { ApplicationStatus } from '../enums/job-application-status.enum';
import { Applicants } from './applicants.entity';
import { Programs } from './programs.entity';

@Entity()
export class Applications extends BaseModel {
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
    applicants: Applicants;

    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    })
    status: ApplicationStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

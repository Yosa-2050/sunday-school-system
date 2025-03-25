import { Entity, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApplicationStatus } from '../enums/job-application-status.enum';
import { Applicants } from './applicants.entity';
import { Jobs } from './jobs.entity';
import { BaseModel } from '@shega/Utilities/entities/base-model.entity';

@Entity()
export class JobApplication extends BaseModel {

    @ManyToOne(() => Jobs, (job) => job.applications, { onDelete: 'CASCADE', eager: true })
    job: Jobs;

    @ManyToOne(() => Applicants, (app) => app.applications, { onDelete: 'CASCADE', eager: true })
    applicants: Applicants;

    @Column({ nullable: true })
    coverLetter?: string;

    @Column({ nullable: true })
    resumeUrl?: string; // Store URL if using cloud storage

    @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.PENDING })
    status: ApplicationStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

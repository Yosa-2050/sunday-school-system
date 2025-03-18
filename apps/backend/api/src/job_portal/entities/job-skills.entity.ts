import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Jobs } from './jobs.entity';

@Entity()
export class JobSkills extends BaseModel {
    @ManyToOne(() => Jobs, {
        eager: true,
        nullable: false,
    })
    job: Jobs;

    @Column()
    skill: string;
}

import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Classes } from './classes.entity';
import { Subjects } from './subject.entity';

@Entity()
export class SubjectAssignment extends BaseModel {
    @ManyToOne(() => Classes)
    class: Classes;

    @ManyToOne(() => Subjects, { eager: true })
    subject: Subjects;

    @Column()
    subjectTitle: string;

    @Column({ nullable: true })
    description: string;
}

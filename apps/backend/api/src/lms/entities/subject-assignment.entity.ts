import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Classes } from './classes.entity';
import { Subjects } from './subject.entity';
import { Teacher } from './teacher.entity';

@Entity()
export class SubjectAssignment extends BaseModel {
    @ManyToOne(() => Classes, { eager: true })
    class: Classes;

    @ManyToOne(() => Subjects, { eager: true })
    subject: Subjects;

    @ManyToOne(() => Teacher, { eager: true })
    teacher: Teacher;

    @Column()
    subjectTitle: string;

    @Column({ nullable: true })
    subjectDescription: string;
}

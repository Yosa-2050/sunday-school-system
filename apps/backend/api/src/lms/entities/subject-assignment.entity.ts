import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Classes } from './classes.entity';
import { Subjects } from './subject.entity';
import { TeacherAssignment } from './teacher-assignment.entity';

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

    @OneToMany(
        () => TeacherAssignment,
        (teacher) => teacher.subjectAssignment,
        {
            lazy: true,
        },
    )
    teachers: TeacherAssignment[];
}

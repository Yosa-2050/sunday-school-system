import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Classes } from '@shega/lms/entities/classes.entity';
import { SubjectAssignment } from '@shega/lms/entities/subject-assignment.entity';
import { Teacher } from '@shega/lms/entities/teacher.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class AttendanceInformation extends BaseModel {
    @ManyToOne(() => Classes, { eager: true })
    class: Classes;

    @ManyToOne(() => SubjectAssignment, { nullable: true, eager: true })
    subject: SubjectAssignment;

    @ManyToOne(() => Teacher, { nullable: true, eager: true })
    teacher: Teacher;

    @Column()
    date: Date;

    @Column({ default: false })
    isCompleted: boolean;
}

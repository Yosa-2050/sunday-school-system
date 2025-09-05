import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Classes } from '@shega/lms/entities/classes.entity';
import { Subjects } from '@shega/lms/entities/subject.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Attendance } from './attendance.entity';

@Entity()
export class AttendanceInformation extends BaseModel {
    @ManyToOne(() => Classes, { eager: true })
    class: Classes;

    @ManyToOne(() => Subjects, { nullable: true, eager: true })
    subject: Subjects;

    @Column()
    date: Date;

    @OneToMany(
        () => Attendance,
        (attendance) => attendance.attendanceData,
        {
            lazy: true,
            cascade: true,
        },
    )
    attendances: Attendance[];
}

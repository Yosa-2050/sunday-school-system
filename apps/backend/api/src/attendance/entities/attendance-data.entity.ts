import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Classes } from '@shega/lms/entities/classes.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Attendance } from './attendance.entity';

@Entity()
export class AttendanceInformation extends BaseModel {
    @ManyToOne(() => Classes, { eager: true })
    class: Classes;

    @Column()
    date: Date;

    @OneToMany(
        (type) => Attendance,
        (attendance) => attendance.attendanceData,
        {
            lazy: true,
            cascade: true,
        },
    )
    attendances: Attendance[];
}

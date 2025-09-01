import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Attendance } from '@shega/attendance/entities/attendance.entity';
import { Profile } from '@shega/users/entities/profile.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Classes } from './classes.entity';

@Entity()
export class Students extends BaseModel {
    @Column({ nullable: true })
    idNumber: string;

    @ManyToOne((type) => Profile, { eager: true, cascade: true })
    profile: Profile;

    @ManyToOne((type) => Classes, { eager: true })
    class: Classes;

    @Column({ nullable: true })
    schoolName: string;

    @Column({ nullable: true })
    schoolGrade: string;

    @OneToMany(
        (type) => Attendance,
        (attendance) => attendance.student,
        {
            lazy: true,
        },
    )
    attendances: Attendance[];
}

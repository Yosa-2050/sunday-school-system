import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Profile } from '@shega/users/entities/profile.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Classes } from './classes.entity';

@Entity()
export class Students extends BaseModel {
    @Column({ nullable: true })
    idNumber: string;

    @ManyToOne((type) => Profile, { eager: true, cascade: true })
    profile: Profile;

    @ManyToOne((type) => Classes, { eager: true })
    class: Classes;

    // @OneToMany((type) => Attendance, (attendance) => attendance.student, {
    // lazy: true,
    // })
    // attendances: Attendance[];
}

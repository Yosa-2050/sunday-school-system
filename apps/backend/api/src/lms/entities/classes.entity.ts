import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CalendarYear } from './calendar-year.entity';
import { RootClass } from './root-class.entity';
import { Students } from './students.entity';
import { SubjectAssignment } from './subject-assignment.entity';

@Entity()
export class Classes extends BaseModel {
    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    hasSection: boolean;

    @Column()
    isSection: boolean;

    @ManyToOne(() => Classes, { lazy: true })
    parent: Classes;

    @ManyToOne(() => RootClass, { eager: true })
    root: RootClass;

    @ManyToOne(() => CalendarYear, { lazy: true })
    calendarYear: CalendarYear;

    @OneToMany(
        () => Classes,
        (child) => child.parent,
        {
            cascade: true,
        },
    )
    sections: Classes[];

    @OneToMany(
        () => Students,
        (stu) => stu.class,
        { lazy: true },
    )
    students: Students[];

    @OneToMany(
        () => SubjectAssignment,
        (assign) => assign.class,
        { lazy: true },
    )
    subjects: SubjectAssignment[];
}

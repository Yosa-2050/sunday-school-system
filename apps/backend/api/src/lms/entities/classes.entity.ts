import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CalendarYear } from './calendar-year.entity';
import { RootClass } from './root-class.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { Students } from './students.entity';

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

    @ManyToOne(() => RootClass, { lazy: true })
    root: RootClass;

    @ManyToOne(() => CalendarYear, { lazy: true })
    calendarYear: CalendarYear;

    @OneToMany(
        () => Classes,
        (child) => child.parent,
        {
            lazy: true,
            cascade: true,
        },
    )
    sections: Classes[];

    students: Students[];
}

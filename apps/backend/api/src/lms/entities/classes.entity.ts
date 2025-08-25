import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Program } from './program.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { Students } from './students.entity';

@Entity()
export class Classes extends BaseModel {
    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    isRoot: boolean;

    @Column()
    hasSection: boolean;

    @Column()
    isSection: boolean;

    @ManyToOne(() => Classes, { lazy: true })
    parent: Classes;

    @OneToMany(
        () => Classes,
        (child) => child.parent,
        {
            lazy: true,
            cascade: true,
        },
    )
    sections: Classes[];

    @ManyToOne(() => Program, { lazy: true })
    program: Program;

    students: Students[];
}

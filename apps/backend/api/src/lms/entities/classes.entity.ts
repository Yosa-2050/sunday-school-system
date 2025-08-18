import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
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

    students: Students[];
}

import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Group extends BaseModel {
    @Column()
    name: string;

    @ManyToOne(() => Group, { lazy: true })
    parent: Group;

    @OneToMany(
        () => Group,
        (child) => child.parent,
        {
            lazy: true,
            cascade: true,
        },
    )
    child: Group[];

    @Column()
    isRoot: boolean;

    @Column()
    hasChild: boolean;
}

import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Category extends BaseModel {
    @Column()
    name: string;

    @ManyToOne(() => Category, { lazy: true })
    parent: Category;

    @OneToMany(
        () => Category,
        (child) => child.parent,
        {
            lazy: true,
            cascade: true,
        },
    )
    child: Category[];

    @Column()
    isRoot: boolean;

    @Column()
    hasChild: boolean;
}

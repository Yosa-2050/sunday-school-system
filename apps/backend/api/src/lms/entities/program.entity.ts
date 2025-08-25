import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Classes } from './classes.entity';

@Entity()
export class Program extends BaseModel {
    @Column()
    name: string;

    @OneToMany(
        () => Classes,
        (child) => child.parent,
        {
            lazy: true,
            cascade: true,
        },
    )
    classes: Classes[];
}

import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Branch } from '@shega/organization/entities/branch.entity';
import { Organization } from '@shega/organization/entities/organization.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
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

    @ManyToOne(() => Organization, {
        lazy: true,
        nullable: true,
    })
    organization: Organization;

    @ManyToOne((type) => Branch, { lazy: true, nullable: true })
    branch: Branch;
}

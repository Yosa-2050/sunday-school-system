import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DepartmentMember } from './department-member.entity';
import { Organization } from './organization.entity';

@Entity()
export class Department extends BaseModel {
    @Column()
    name: string;

    @ManyToOne(() => Department, { lazy: true })
    parent: Department;

    @OneToMany(
        () => Department,
        (child) => child.parent,
        {
            lazy: true,
            cascade: true,
        },
    )
    child: Department[];

    @OneToMany(
        () => DepartmentMember,
        (dm) => dm.department,
    )
    departmentMembers: DepartmentMember[];

    @ManyToOne(() => Organization, {
        lazy: true,
        nullable: true,
        eager: true,
    })
    organization: Organization;
}

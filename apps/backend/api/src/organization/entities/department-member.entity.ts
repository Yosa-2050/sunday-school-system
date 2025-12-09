import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Department } from './department.entity';
import { OrganizationMembers } from './organization-member.entity';

@Entity()
export class DepartmentMember extends BaseModel {
    @ManyToOne(
        () => Department,
        (department) => department.departmentMembers,
        { eager: true },
    )
    @JoinColumn({ name: 'departmentId' })
    department: Department;

    @Column()
    departmentId: string;

    @ManyToOne(
        () => Department,
        (department) => department.departmentMembers,
        { eager: true },
    )
    @JoinColumn({ name: 'subDepartmentId' })
    subDepartment: Department;

    @Column({ nullable: true })
    subDepartmentId: string;

    @ManyToOne(
        () => OrganizationMembers,
        (member) => member.departmentMembers,
        { eager: true },
    )
    @JoinColumn({ name: 'memberId' })
    member: OrganizationMembers;

    @Column()
    memberId: string;

    @Column({ nullable: true })
    position: string;

    @Column({ type: 'timestamp', nullable: true })
    startDate: string;

    @Column({ type: 'timestamp', nullable: true })
    endDate: string;
}

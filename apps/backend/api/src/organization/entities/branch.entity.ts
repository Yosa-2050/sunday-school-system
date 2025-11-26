import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { OrganizationMembers } from './organization-member.entity';
import { Organization } from './organization.entity';

@Entity()
export class Branch extends BaseModel {
    @Column()
    name: string;

    @Column()
    isMainBranch: boolean;

    @ManyToOne(() => Organization, { lazy: true })
    organization: Organization;

    @OneToMany(
        () => OrganizationMembers,
        (members) => members.branch,
        {
            lazy: true,
        },
    )
    members: OrganizationMembers[];
}

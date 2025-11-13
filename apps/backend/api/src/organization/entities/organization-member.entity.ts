import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Profile } from '@shega/users/entities/profile.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { OrganizationMemberType } from '../enums/employee-type.enum';
import { Branch } from './branch.entity';
import { Organization } from './organization.entity';

@Entity()
export class OrganizationMembers extends BaseModel {
    @Column({ nullable: true })
    id_number: string;

    @ManyToOne(() => Profile, { eager: true, cascade: true })
    profile: Profile;

    @ManyToOne(() => Organization, {
        lazy: true,
        nullable: false,
        cascade: ['insert'],
    })
    organization: Organization;

    @Column({ nullable: false })
    type: OrganizationMemberType;

    @ManyToOne((type) => Branch, { lazy: true, nullable: true })
    branch: Branch;
}

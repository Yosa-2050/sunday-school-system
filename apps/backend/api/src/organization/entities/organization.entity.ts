import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { LookUps } from '@shega/Utilities/entities/lookups.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ContactDetails } from '@shega/location/entities/contact-details.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { Location } from '@shega/location/entities/location.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { Notes } from '@shega/notification/entities/notes.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CompanySize } from '../enums/company-size.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { CompanyType } from '../enums/company-type.enum';
import { Branch } from './branch.entity';
import { OrganizationMembers } from './organization-member.entity';

@Entity()
export class Organization extends BaseModel {
    @Column()
    name: string;

    @Column({ nullable: true })
    registrationNumber: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    displayName: string;

    @Column({ nullable: true })
    type: CompanyType;

    @ManyToOne(() => LookUps, { eager: true, nullable: true })
    industry: LookUps;

    @Column({ nullable: true })
    yearFounded: string;

    @Column({ nullable: true })
    companySize: CompanySize;

    @OneToMany(
        (type) => Branch,
        (branches) => branches.organization,
        {
            cascade: true,
            lazy: true,
        },
    )
    branches: Branch[];

    @Column({ default: false })
    hasBranches: boolean;

    @OneToMany(
        (type) => OrganizationMembers,
        (member) => member.organization,
        {
            lazy: true,
        },
    )
    members: OrganizationMembers[];

    @Column({ nullable: true })
    status: ApprovalType;

    @Column({ nullable: true })
    corporateEmail: string;

    @Column({ nullable: true })
    logo: string;

    locations: Location;
    contacts: ContactDetails[];
    notes: Notes[];
}

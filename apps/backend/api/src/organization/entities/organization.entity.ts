import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ContactDetails } from '@shega/location/entities/contact-details.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { Location } from '@shega/location/entities/location.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Branch } from './branch.entity';
import { EmployeeOrganization } from './employee-organization.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';

@Entity()
export class Organization extends BaseModel {
    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    tinNumber: string;

    @Column({ nullable: true })
    displayName: string;

    @Column({ nullable: true })
    note: string;

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
        (type) => EmployeeOrganization,
        (employee) => employee.organization,
        {
            lazy: true,
        },
    )
    employee: EmployeeOrganization[];

    @Column({ nullable: true })
    status: ApprovalType;

    locations: Location[];
    contacts: ContactDetails[];
}

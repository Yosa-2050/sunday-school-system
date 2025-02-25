import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import type { ContactDetails } from '@shega/location/entities/contact-details.entity';
import type { Location } from '@shega/location/entities/location.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Branch } from './branch.entity';
import { EmployeeOrganization } from './employee-organization.entity';

@Entity()
export class Organization extends BaseModel {
    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    tinNumber: string;

    @Column()
    displayName: string;

    @OneToMany(
        (type) => Branch,
        (branches) => branches.organization,
        {
            cascade: true,
            lazy: true,
        },
    )
    branches: Branch[];

    @Column({ default: true })
    hasBranches: boolean;

    @OneToMany(
        (type) => EmployeeOrganization,
        (employee) => employee.organization,
        {
            lazy: true,
        },
    )
    employee: EmployeeOrganization[];

    locations: Location[];
    contacts: ContactDetails[];
}

import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { Category } from '@shega/job_portal/entities/category.entity';
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
import { EmployeeOrganization } from './employee-organization.entity';

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

    @ManyToOne(() => Category, { eager: true, nullable: true })
    sector: Category;

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
    notes: Notes[];
}

import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { EmployeeType } from '../enums/employee-type.enum';
import { Branch } from './branch.entity';
import { Employee } from './employee.entity';
import { Organization } from './organization.entity';

@Entity()
export class EmployeeOrganization extends BaseModel {
    @ManyToOne(() => Organization, {
        lazy: true,
        nullable: false,
        cascade: ['insert'],
    })
    organization: Organization;

    @ManyToOne(() => Employee, {
        eager: true,
        nullable: false,
        cascade: ['insert'],
    })
    employee: Employee;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: false })
    type: EmployeeType;

    @ManyToOne((type) => Branch, { lazy: true, nullable: true })
    branch: Branch;
}

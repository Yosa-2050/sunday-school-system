import { BaseModel } from 'src/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { EmployeeType } from '../enums/employee-type.enum';
import { Branch } from './branch.entity';
import { Employee } from './employee.entity';
import { Organization } from './organization.entity';

@Entity()
export class EmployeeOrganization extends BaseModel {
    @ManyToOne(() => Organization, { lazy: true, nullable: false })
    organization: Organization;

    @ManyToOne(() => Employee, { eager: true, nullable: false })
    employee: Employee;

    @Column({ nullable: false })
    type: EmployeeType;

    @ManyToOne((type) => Branch, { lazy: true, nullable: true })
    branch: Branch;
}

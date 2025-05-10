import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { EmployeeOrganization } from '@shega/organization/entities/employee-organization.entity';
import { Organization } from '@shega/organization/entities/organization.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CurrencyType } from '../enums/currency-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { EmploymentType } from '../enums/employment-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { SalaryFrequencyType } from '../enums/salary-frequency-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { SalaryType } from '../enums/salary-type.enum';
import { Programs } from './programs.entity';

@Entity()
export class Jobs extends BaseModel {
    @Column({ nullable: true })
    type: EmploymentType;

    @Column({ nullable: true })
    salaryFrom: number;

    @Column({ nullable: true })
    salaryTo: number;

    @Column({ nullable: true })
    salaryType: SalaryType;

    @Column({ nullable: true })
    salaryFrequency: SalaryFrequencyType;

    @Column({ nullable: true })
    currency: CurrencyType;

    @ManyToOne(() => Organization, { eager: true, nullable: false })
    organization: Organization;

    @ManyToOne(() => EmployeeOrganization, { eager: true, nullable: true })
    postedBy: EmployeeOrganization;

    @JoinColumn()
    @OneToOne(() => Programs, {
        eager: true,
        cascade: true,
        onUpdate: 'NO ACTION',
    })
    program: Programs;
}

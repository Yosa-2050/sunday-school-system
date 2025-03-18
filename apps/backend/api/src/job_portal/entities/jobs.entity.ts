import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { EmployeeOrganization } from '@shega/organization/entities/employee-organization.entity';
import { Organization } from '@shega/organization/entities/organization.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { EmploymentType } from '../enums/employment-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { SalaryType } from '../enums/salary-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { SalaryFrequencyType } from '../enums/salary-frequency-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { WorkPlaceType } from '../enums/work-place-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ExperianceLevelType } from '../enums/experiance-level-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { EducationalRequirmentType } from '../enums/education-requirment-type.enum';
import { JobCategory } from './job-category.entity';
import { JobSkills } from './job-skills.entity';

@Entity()
export class Jobs extends BaseModel {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    type: EmploymentType;

    @Column({nullable: true})
    salaryFrom: number;

    @Column({nullable: true})
    salaryTo: number;

    @Column()
    salary: SalaryType; //fixed, negotiable 

    @Column({nullable: true})
    salaryFrequency: SalaryFrequencyType;

    @Column()
    status: ApprovalType;

    @Column()
    workPlace: WorkPlaceType;

    @Column()
    country: string;

    @Column()
    state: string;

    @Column()
    city: string;

    @Column()
    experianceLevel: ExperianceLevelType;

    @Column()
    experiance: number;

    @Column()
    deadline: Date;

    @Column()
    educationalRequirment: EducationalRequirmentType;

    @OneToMany(() => JobSkills, skill => skill.job)
    skills: JobSkills[];

    @OneToMany(() => JobCategory, category => category.job)
    catagory: JobCategory[];


    @Column()
    isPublished: boolean;

    @Column()
    postedDate: Date;

    @ManyToOne(() => Organization, { eager: true, nullable: false })
    organization: Organization;

    @ManyToOne(() => EmployeeOrganization, { eager: true, nullable: true })
    postedBy: EmployeeOrganization;


}

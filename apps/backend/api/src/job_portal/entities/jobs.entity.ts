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
import { LocationInfo } from '@shega/location/entities/LocationInfo.entity';
import { Country } from '@shega/location/entities/country.entity';

@Entity()
export class Jobs extends BaseModel {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column({nullable: true})
    type: EmploymentType;

    @Column({ nullable: true })
    salaryFrom: number;

    @Column({ nullable: true })
    salaryTo: number;

    @Column({nullable: true})
    salaryType: SalaryType; //fixed, negotiable

    @Column({ nullable: true })
    salaryFrequency: SalaryFrequencyType;

    @Column({nullable: true})
    status: ApprovalType;

    @Column({nullable: true})
    workPlace: WorkPlaceType;

    @ManyToOne(() => Country, { eager: true, nullable: true })
    country: Country;

    @ManyToOne(() => LocationInfo, { eager: true, nullable: true })
    state: LocationInfo;

    @ManyToOne(() => LocationInfo, { eager: true, nullable: true })
    city: LocationInfo;

    @Column({nullable: true})
    experianceLevel: ExperianceLevelType;

    @Column({nullable: true})
    experiance: number;

    @Column({nullable: true})
    deadline: Date;

    @Column({nullable: true})
    educationalRequirment: EducationalRequirmentType;

    @OneToMany(
        () => JobSkills,
        (skill) => skill.job,
        {cascade: true}
    )
    jobSkills: JobSkills[];

    @OneToMany(
        () => JobCategory,
        (category) => category.job,
        {cascade: true}
    )
    jobCategory: JobCategory[];

    @Column({default: false})
    isPublished: boolean;

    @Column({nullable: true})
    postedDate: Date;

    @ManyToOne(() => Organization, { eager: true, nullable: false })
    organization: Organization;

    @ManyToOne(() => EmployeeOrganization, { eager: true, nullable: true })
    postedBy: EmployeeOrganization;
}

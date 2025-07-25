import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { LocationInfo } from '@shega/location/entities/LocationInfo.entity';
import { Country } from '@shega/location/entities/country.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { EducationalRequirementType } from '../enums/education-requirement-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ExperienceLevelType } from '../enums/experience-level-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ProgramType } from '../enums/program-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { WorkPlaceType } from '../enums/work-place-type.enum';
import { Applications } from './job-application.entity';
import { ProgramCategory } from './job-category.entity';
import { ProgramDescription } from './job-description.entity';
import { ProgramSkills } from './job-skills.entity';

@Entity()
export class Programs extends BaseModel {
    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    status: ApprovalType;

    @Column({ nullable: true })
    workPlace: WorkPlaceType;

    @Column({ nullable: true })
    numberOfApplicants: number;

    @ManyToOne(() => Country, { eager: true, nullable: true })
    country: Country;

    @ManyToOne(() => LocationInfo, { eager: true, nullable: true })
    state: LocationInfo;

    @ManyToOne(() => LocationInfo, { eager: true, nullable: true })
    city: LocationInfo;

    @Column({ nullable: true })
    experianceLevel: ExperienceLevelType;

    @Column({ nullable: true })
    experiance: number;

    @Column({ nullable: true, type: 'timestamp with time zone' })
    deadline: Date;

    get isExpired(): boolean {
        return new Date() > new Date(this.deadline);
    }

    @Column({ default: false })
    isClosed: boolean;

    @Column({ nullable: true })
    educationalRequirment: EducationalRequirementType;

    @OneToMany(
        () => ProgramSkills,
        (skill) => skill.program,
        { cascade: true, onUpdate: 'CASCADE' },
    )
    programSkills: ProgramSkills[];

    @OneToMany(
        () => ProgramCategory,
        (category) => category.program,
        { cascade: true, onUpdate: 'CASCADE' },
    )
    programCategory: ProgramCategory[];

    @OneToMany(
        () => ProgramDescription,
        (description) => description.program,
        { cascade: true, onUpdate: 'CASCADE' },
    )
    programDescriptions: ProgramDescription[];

    @Column({ default: false })
    isPublished: boolean;

    @Column({ nullable: true, type: 'timestamp with time zone' })
    postedDate: Date;

    @Column({ nullable: true })
    programType: ProgramType;

    @OneToMany(
        () => Applications,
        (application) => application.program,
    )
    applications: Applications[];
}

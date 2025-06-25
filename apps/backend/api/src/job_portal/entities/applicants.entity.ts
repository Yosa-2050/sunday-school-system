import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Profile } from '@shega/users/entities/profile.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ApplicantSkills } from './applicants-skills.entity';
import { EducationHistory } from './educational-history.entity';
import { Experiance } from './experience.entity';
import { Applications } from './job-application.entity';

@Entity()
export class Applicants extends BaseModel {
    @ManyToOne((type) => Profile, { eager: true, cascade: true })
    profile: Profile;

    @Column({ nullable: true })
    headline: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    cv: string;

    @Column({ nullable: true })
    coverLetter: string;

    @Column({ default: false })
    canApply: boolean;

    @Column({ default: 0 })
    percentageCompleted: number;

    @OneToMany(
        () => Applications,
        (application) => application.applicants,
        { lazy: true },
    )
    applications: Applications[];

    @OneToMany(
        () => EducationHistory,
        (history) => history.applicant,
        { cascade: true },
    )
    educationalHistory: EducationHistory[];

    @OneToMany(
        () => Experiance,
        (experience) => experience.applicant,
        { cascade: true },
    )
    experiance: Experiance[];

    @OneToMany(
        () => ApplicantSkills,
        (skill) => skill.applicant,
        { cascade: true },
    )
    skills: ApplicantSkills[];
}

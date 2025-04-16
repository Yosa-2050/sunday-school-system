import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Profile } from '@shega/users/entities/profile.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ApplicantSkills } from './applicants-skills.entity';
import { EducationHistory } from './educational-history.entity';
import { Experiance } from './experiance.entity';
import { JobApplication } from './job-application.entity';

@Entity()
export class Applicants extends BaseModel {
    @ManyToOne((type) => Profile, { eager: true, cascade: true })
    profile: Profile;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    cv: string;

    @Column({ nullable: true })
    coverLetter: string;

    @OneToMany(
        () => JobApplication,
        (application) => application.applicants,
        {lazy: true}
    )
    applications: JobApplication[];

    @OneToMany(
        () => EducationHistory,
        (history) => history.applicant,
        { cascade: true , lazy: true},
    )
    educationalHistory: EducationHistory[];

    @OneToMany(
        () => Experiance,
        (experiance) => experiance.applicant,
        { cascade: true, lazy: true },
    )
    experiance: Experiance[];

    @OneToMany(
        () => ApplicantSkills,
        (skill) => skill.applicant,
        { cascade: true },
    )
    skills: ApplicantSkills[];
}

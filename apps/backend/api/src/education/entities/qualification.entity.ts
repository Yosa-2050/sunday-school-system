import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Profile } from '@shega/users/entities/profile.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { EducationHistory } from './educational-history.entity';
import { Experience } from './experience.entity';
import { QualificationSkills } from './qualification-skills.entity';

@Entity()
export class Qualification extends BaseModel {
    @ManyToOne((type) => Profile, { eager: true, cascade: true })
    profile: Profile;

    @OneToMany(
        () => EducationHistory,
        (history) => history.applicant,
        { cascade: true },
    )
    educationalHistory: EducationHistory[];

    @OneToMany(
        () => Experience,
        (experience) => experience.applicant,
        { cascade: true },
    )
    experience: Experience[];

    @OneToMany(
        () => QualificationSkills,
        (skill) => skill.applicant,
        { cascade: true },
    )
    skills: QualificationSkills[];
}

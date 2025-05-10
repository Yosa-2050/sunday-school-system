import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { Profile } from '@shega/users/entities/profile.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EducationHistory } from './educational-history.entity';
import { Experiance } from './experiance.entity';

@Entity()
export class Mentors extends BaseModel {
    @ManyToOne((type) => Profile, { eager: true, cascade: true })
    profile: Profile;

    @Column()
    status: ApprovalType;

    @Column({ nullable: true })
    note: string;

    @OneToMany(
        () => EducationHistory,
        (history) => history.applicant,
        { cascade: true, lazy: true },
    )
    educationalHistory: EducationHistory[];

    @OneToMany(
        () => Experiance,
        (experiance) => experiance.applicant,
        { cascade: true, lazy: true },
    )
    experiance: Experiance[];
}

import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Profile } from '@shega/users/entities/profile.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { JobApplication } from './job-application.entity';

@Entity()
export class Applicants extends BaseModel {
    @ManyToOne((type) => Profile, { eager: true, cascade: true })
    profile: Profile;

    @OneToMany(
        () => JobApplication,
        (application) => application.applicants,
    )
    applications: JobApplication[];
}

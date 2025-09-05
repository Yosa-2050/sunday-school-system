import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Profile } from '@shega/users/entities/profile.entity';
import { ManyToOne } from 'typeorm';
import { Program } from './program.entity';

export class Teacher extends BaseModel {
    @ManyToOne(() => Profile, { eager: true, cascade: true })
    profile: Profile;

    @ManyToOne(() => Program, { lazy: true })
    program: Program;
}

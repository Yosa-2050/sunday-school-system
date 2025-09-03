import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Profile } from '@shega/users/entities/profile.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Program } from './program.entity';

@Entity()
export class ProgramUser extends BaseModel {
    @Column({ nullable: true })
    id_number: string;

    @ManyToOne((type) => Profile, { eager: true, cascade: true })
    profile: Profile;

    @ManyToOne((type) => Program, { eager: true, cascade: true })
    program: Program;
}

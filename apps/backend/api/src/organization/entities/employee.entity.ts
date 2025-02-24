import { BaseModel } from 'src/Utilities/entities/base-model.entity';
import { Profile } from 'src/users/entities/profile.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Employee extends BaseModel {
    @Column({ nullable: true })
    id_number: string;

    @ManyToOne((type) => Profile, { eager: true, cascade: true })
    profile: Profile;
}

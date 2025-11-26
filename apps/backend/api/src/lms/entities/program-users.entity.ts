import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { OrganizationMembers } from '@shega/organization/entities/organization-member.entity';
import { Profile } from '@shega/users/entities/profile.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Program } from './program.entity';
@Entity()
export class ProgramUser extends BaseModel {
    //TO BE removed after migration
    @ManyToOne((type) => Profile, {
        eager: true,
        cascade: true,
        nullable: true,
    })
    profile: Profile;

    @ManyToOne(() => OrganizationMembers, {
        eager: true,
        cascade: true,
        nullable: true,
    })
    member: OrganizationMembers;

    @ManyToOne((type) => Program, { eager: true, cascade: true })
    program: Program;
}

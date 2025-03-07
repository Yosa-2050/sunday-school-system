import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Profile } from '@shega/users/entities/profile.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserRoles } from './role.entity';

@Entity()
class User extends BaseModel {
    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    userName: string;

    @Exclude()
    @Column()
    password: string;

    @Column({ default: false })
    pwd_change_required: boolean;

    @Column({ default: false })
    email_confirmed: boolean;

    @OneToOne(
        () => Profile,
        (profile) => profile.user,
        { eager: true },
    )
    @JoinColumn()
    profile: Profile;

    @OneToMany(
        () => UserRoles,
        (roles) => roles.user,
        {
            eager: true,
            cascade: true,
            onUpdate: 'NO ACTION',
        },
    )
    roles: UserRoles[];
}
export { User };

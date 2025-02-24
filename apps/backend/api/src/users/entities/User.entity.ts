import { BaseModel } from "src/Utilities/entities/base-model.entity";
import { Profile } from "src/users/entities/profile.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { UserRoles } from "./role.entity";
import { Exclude } from "class-transformer";

@Entity()
export class User extends BaseModel {
  @Column()
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

  @OneToOne(() => Profile, (profile) => profile.user, { eager: true })
  @JoinColumn()
  profile: Profile;

  @OneToMany((type) => UserRoles, (roles) => roles.user, {
    lazy: true,
    cascade: true,
    onUpdate: "NO ACTION"
  })
  roles: UserRoles[];
}

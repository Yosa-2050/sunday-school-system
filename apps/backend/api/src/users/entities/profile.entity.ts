import { User } from "src/users/entities/user.entity";
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  OneToOne,
} from "typeorm";
import { Title } from "../enums/profile-title.enum";
import { BaseModel } from "src/Utilities/entities/base-model.entity";
import { Gender } from "../enums/profile-gender.enum";
import { MarriageStatus } from "../enums/profile-marriagestatus.enum";

@Entity()
export class Profile extends BaseModel {
  @OneToOne(() => User, (user) => user.profile, { lazy: true, cascade: true })
  user: User;

  @Column()
  firstName: string;

  @Column()
  middleName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  mothersFullName: string;

  @Column({ nullable: true })
  baptistName: string;

  @Column({ nullable: true })
  birthDate: string;

  @Column({ nullable: true })
  dobGregorian: Date;

  @Column({ nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  marriageStatus?: MarriageStatus;

  @Column({ nullable: true })
  title: Title;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  profile_picture_id: string;

  @AfterInsert()
  logInsert() {}

  @AfterUpdate()
  logUpdate() {}

  @AfterRemove()
  logRemove() {}
}

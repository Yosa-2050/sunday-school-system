import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { User } from '@shega/users/entities/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import type { Gender } from '../enums/profile-gender.enum';
import type { MarriageStatus } from '../enums/profile-marriagestatus.enum';
import type { Title } from '../enums/profile-title.enum';

@Entity()
export class Profile extends BaseModel {
    @OneToOne(
        () => User,
        (user) => user.profile,
        { lazy: true, cascade: true },
    )
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

    // @AfterInsert()
    // logInsert() {}

    // @AfterUpdate()
    // logUpdate() {}

    // @AfterRemove()
    // logRemove() {}
}

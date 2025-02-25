import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import type { UserRoleType } from '../enums/user-role.enum';
import { User } from './user.entity';

@Entity()
export class UserRoles extends BaseModel {
    @Column()
    role: UserRoleType;

    @Column({ default: true })
    isDefault: boolean;

    @ManyToOne(() => User)
    user: User;
}

import { Students } from '@shega/lms/entities/students.entity';
import { BaseModel } from 'src/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { PermissionType } from '../enums/permission-type.enum';

@Entity()
export class Permission extends BaseModel {
    @ManyToOne((type) => Students)
    student: Students;

    @Column()
    type: PermissionType;

    @Column()
    value: string;
}

import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Department extends BaseModel {
    @Column()
    name: string;
}

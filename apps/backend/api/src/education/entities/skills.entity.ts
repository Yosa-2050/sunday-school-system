import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Skills extends BaseModel {
    @Column()
    name: string;
}

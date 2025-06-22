import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Notes extends BaseModel {
    @Column()
    reference: string;

    @Column()
    type: string;

    @Column()
    note: string;
}

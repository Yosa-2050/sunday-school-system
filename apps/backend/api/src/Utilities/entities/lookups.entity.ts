import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model.entity';

@Entity()
export class LookUps extends BaseModel {
    @Column()
    code: string;

    @Column()
    value: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    group: string;

    @Column({ nullable: true })
    subGroup: string;
}

import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Program } from './program.entity';

@Entity()
export class Subjects extends BaseModel {
    @Column()
    name: string;

    @ManyToOne(() => Program, { lazy: true })
    program: Program;
}

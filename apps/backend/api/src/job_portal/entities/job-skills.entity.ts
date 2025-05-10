import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Programs } from './programs.entity';

@Entity()
export class ProgramSkills extends BaseModel {
    @ManyToOne(() => Programs, {
        nullable: false,
    })
    program: Programs;

    @Column()
    skill: string;
}

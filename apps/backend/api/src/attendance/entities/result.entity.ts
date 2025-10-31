import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Students } from '@shega/lms/entities/students.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Test } from './test.entity';

@Entity()
export class Result extends BaseModel {
    @ManyToOne(() => Students, { eager: true })
    student: Students;

    @ManyToOne(() => Test, { eager: true })
    test: Test;

    @Column()
    score: number;
}

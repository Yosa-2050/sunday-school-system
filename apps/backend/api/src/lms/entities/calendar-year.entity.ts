import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Program } from './program.entity';

@Entity()
export class CalendarYear extends BaseModel {
    @Column()
    name: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @ManyToOne(() => Program, { lazy: true, nullable: false })
    program: Program;
}

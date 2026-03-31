import { BaseModel } from 'src/Utilities/entities/base-model.entity';
import { Column, Entity } from 'typeorm';
import { AttendanceStatus } from '../enums/attendance-status.enum';

@Entity()
export class AttendanceDetail extends BaseModel {
    @Column()
    referenceId: string;

    @Column({ type: 'date'})
    date: Date;

    @Column({ nullable: true })
    startTime?: string;

    @Column({ nullable: true })
    endTime?: string;

    @Column({ nullable: true, type: 'text' })
    remarks?: string;

    @Column({ default: false })
    isCompleted: boolean;
}

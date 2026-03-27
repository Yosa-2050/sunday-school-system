import { BaseModel } from 'src/Utilities/entities/base-model.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class AttendanceDetail extends BaseModel {
    @Column()
    referenceId: string;

    @Column({ type: 'date' })
    date: Date;

    @Column()
    startTime?: string;

    @Column()
    endTime?: string;

    @Column()
    isCompleted: boolean;
}

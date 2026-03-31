import { Students } from '@shega/lms/entities/students.entity';
import { BaseModel } from 'src/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AttendanceStatus } from '../enums/attendance-status.enum';

@Entity()
export class Attendance extends BaseModel {
    @Column({ nullable: true })
    attendanceDataId: string;

    @ManyToOne(() => Students, { eager: true, nullable: true })
    student: Students;

    @Column({ nullable: true })
    referenceId: string;

    @Column({ nullable: true })
    memberId: string;

    @Column()
    status: AttendanceStatus;

    @Column({ nullable: true })
    remarks: string;
}

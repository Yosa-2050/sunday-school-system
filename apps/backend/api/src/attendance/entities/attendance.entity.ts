import { Students } from '@shega/lms/entities/students.entity';
import { BaseModel } from 'src/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { AttendanceStatus } from '../enums/attendance-status.enum';

@Entity()
export class Attendance extends BaseModel {
    @Column()
    attendanceDataId: string;

    @ManyToOne(() => Students, { eager: true })
    student: Students;

    @Column()
    status: AttendanceStatus;

    @Column({ nullable: true })
    remark: string;
}

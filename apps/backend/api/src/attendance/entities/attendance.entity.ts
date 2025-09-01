import { Students } from '@shega/lms/entities/students.entity';
import { BaseModel } from 'src/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { AttendanceStatus } from '../enums/attendance-status.enum';
import { AttendanceInformation } from './attendance-data.entity';

@Entity()
export class Attendance extends BaseModel {
    @ManyToOne(() => AttendanceInformation, { eager: true })
    attendanceData: AttendanceInformation;

    @ManyToOne(() => Students, { eager: true })
    student: Students;

    @Column()
    status: AttendanceStatus;

    @Column({ nullable: true })
    remark: string;
}

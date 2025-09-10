import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { TeacherType } from '../enums/teacher-type.enums';
import { SubjectAssignment } from './subject-assignment.entity';
import { Teacher } from './teacher.entity';

@Entity()
export class TeacherAssignment extends BaseModel {
    @ManyToOne(() => SubjectAssignment, { eager: true, cascade: true })
    subjectAssignment: SubjectAssignment;

    @ManyToOne(() => Teacher, { eager: true, nullable: true })
    teacher: Teacher;

    @Column()
    teacherType: TeacherType;

    @Column()
    isMain: boolean;
}

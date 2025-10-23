import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { SubjectAssignment } from '@shega/lms/entities/subject-assignment.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Test extends BaseModel {
    @ManyToOne(() => SubjectAssignment, { eager: true, nullable: true })
    @JoinColumn({ name: 'subjectId' }) // use 'subjectId' as foreign key
    subject: SubjectAssignment;

    @Column({ nullable: true })
    subjectId: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    weight: number;

    @Column({ default: 'TEST' })
    type: string;

    @Column({ nullable: true })
    content: string;

    @Column({ nullable: true })
    documentId: string;

    @Column({ default: false })
    isGroupAssignment: boolean;
}

import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { SubjectAssignment } from '@shega/lms/entities/subject-assignment.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Test extends BaseModel {
    @ManyToOne(() => SubjectAssignment, { eager: true })
    subject: SubjectAssignment;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    weight: number;

    //Assignment, Test, Quiz
    @Column({ default: 'TEST' })
    type: string;

    @Column({ nullable: true })
    content: string;

    @Column({ nullable: true })
    documentId: string;

    @Column({ default: false })
    isGroupAssignment: boolean;
}

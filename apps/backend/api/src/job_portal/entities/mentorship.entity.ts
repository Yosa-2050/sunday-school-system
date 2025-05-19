import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CommitmentType } from '../enums/commitment-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ExperianceLevelType } from '../enums/experiance-level-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { MentorshipType } from '../enums/mentorship-type.enum';
import { Programs } from './programs.entity';
import { Mentors } from './mentor.entity';

@Entity()
export class Mentorship extends BaseModel {
    @Column({ nullable: true })
    mentorshipType: MentorshipType;

    @Column({ nullable: true })
    commitment: CommitmentType;

    @Column({ nullable: true })
    duration: number;

    @Column({ nullable: true })
    audience: ExperianceLevelType;

    @ManyToOne(() => Mentors, { eager: true, nullable: true })
    mentor: Mentors;

    @JoinColumn()
    @OneToOne(() => Programs, {
        eager: true,
        cascade: true,
        onUpdate: 'NO ACTION',
    })
    program: Programs;
}

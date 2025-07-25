import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { EducationalRequirementType } from '../enums/education-requirement-type.enum';
import { Applicants } from './applicants.entity';
import { Category } from './category.entity';

@Entity()
export class EducationHistory extends BaseModel {
    @ManyToOne(() => Applicants, {
        lazy: true,
        nullable: false,
    })
    applicant: Applicants;

    @Column()
    school: string;

    @Column()
    level: EducationalRequirementType;

    @ManyToOne(() => Category, { eager: true, nullable: false })
    fieldOfStudy: Category;

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    grade: number;

    @Column()
    description: string;
}

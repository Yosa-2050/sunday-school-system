import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { EducationalRequirmentType } from '../enums/education-requirment-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { Category } from './category.entity';
import { Applicants } from './applicants.entity';

@Entity()
export class EducationHistory extends BaseModel {
    @ManyToOne(() => Applicants, {
        eager: true,
        nullable: false,
    })
    applicant: Applicants;

    @Column()
    school: string;

    @Column()
    level: EducationalRequirmentType;

    @Column()
    fieldOfStudy: Category;

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;

    @Column({ nullable: true })
    grade: number;

    @Column()
    description: string;
}

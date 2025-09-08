import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Qualification } from './qualification.entity';

@Entity()
export class QualificationSkills extends BaseModel {
    @ManyToOne(() => Qualification, {
        lazy: true,
        nullable: false,
    })
    applicant: Qualification;

    @Column()
    skill: string;
}

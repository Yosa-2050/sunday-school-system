import { BaseModel } from 'src/Utilities/entities/base-model.entity';
import { Column, Entity } from 'typeorm';
import type { EmploymentType } from '../enums/employment-type.enum';

@Entity()
export class Jobs extends BaseModel {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    type: EmploymentType;

    @Column()
    salaryFrom: number;

    @Column()
    salaryTo: number;
}

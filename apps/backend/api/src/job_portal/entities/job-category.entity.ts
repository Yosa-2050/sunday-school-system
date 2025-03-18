import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Jobs } from './jobs.entity';
import { Category } from './category.entity';

@Entity()
export class JobCategory extends BaseModel {
    @ManyToOne(() => Jobs, {
        eager: true,
        nullable: false,
    })
    job: Jobs;

    @ManyToOne(() => Category, {
        eager: true,
        nullable: false,
    })
    category: Category;
}

import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { Programs } from './programs.entity';

@Entity()
export class ProgramCategory extends BaseModel {
    @ManyToOne(() => Programs, {
        nullable: false,
    })
    program: Programs;

    @ManyToOne(() => Category, {
        eager: true,
        nullable: false,
    })
    category: Category;
}

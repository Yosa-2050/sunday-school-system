import { Exclude } from 'class-transformer';
import {
    BaseEntity,
    Column,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class BaseModel extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    //Exclude()
    @Column({ nullable: true })
    createdBy: string;

    @Exclude()
    @Column({ nullable: true })
    updatedBy: string;

    //@Exclude()
    @Column({ nullable: true })
    createdAt: Date;

    @Exclude()
    @Column({ nullable: true })
    updatedAt: Date;

    @Exclude()
    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;

    @Column({ default: true })
    isActive: boolean;
}

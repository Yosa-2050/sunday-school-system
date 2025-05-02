import { Inject } from '@nestjs/common';
import { Exclude, Expose } from 'class-transformer';
import {
    BaseEntity,
    Column,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { DateService } from '../date.service';

export abstract class BaseModel extends BaseEntity {
    constructor(@Inject(DateService) private dateService: DateService) {
        super();
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Exclude()
    @Column({ nullable: true })
    createdBy: string;

    @Exclude()
    @Column({ nullable: true })
    updatedBy: string;

    @Exclude()
    @Expose({ groups: ['internal'] })
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

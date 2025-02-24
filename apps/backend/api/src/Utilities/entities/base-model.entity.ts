import { Inject } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import {
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
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

    //TODO: get authenticated user and get time
    @BeforeInsert()
    setCreatedAndUpdatedFieldsOnInsert(): void {
        this.createdBy = 'System';
        this.updatedBy = 'System';
        this.createdAt = new Date();
        this.updatedAt = new Date();
        // this.createdAt = this.dateService.getCurrentDate();
        // this.updatedAt = this.dateService.getCurrentDate();
    }

    @BeforeUpdate()
    setUpdatedFieldsOnUpdate(): void {
        this.updatedBy = 'System';
        this.updatedAt = new Date();
        // this.updatedAt = this.dateService.getCurrentDate();
    }
}

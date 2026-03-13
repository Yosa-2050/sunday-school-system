import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Report } from './report.entity';

@Entity()
export class ReportItem extends BaseModel {
    @Column()
    budgetLine: string;

    @Column()
    documentType: string;

    @Column()
    @Type(() => Number)
    @IsNumber()
    amount: number;

    @Column()
    reason: string;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column({ nullable: true })
    accountNumber: string;

    @Column({ nullable: true })
    accountOwner: string;

    @ManyToOne(
        () => Report,
        (report) => report.items,
    )
    report: Report;
}

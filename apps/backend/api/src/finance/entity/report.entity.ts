import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { User } from '@shega/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ReportItem } from './report-item.entity';

@Entity()
export class Report extends BaseModel {
    @Column()
    date: string;

    @Column()
    requestorName: string;

    @Column()
    department: string;

    @Column({ default: 'pending' })
    status: string;

    @OneToMany(
        () => ReportItem,
        (item) => item.report,
        {
            cascade: true,
            eager: true,
        },
    )
    items: ReportItem[];

    @ManyToOne(() => User, { eager: true })
    requestor: User;
}

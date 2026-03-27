import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Organization } from '@shega/organization/entities/organization.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { EventType } from '../enum/event-type.enum';

@Entity()
export class Event extends BaseModel {
    @Column()
    name: string;

    @Column()
    type: EventType;

    @Column()
    location: string;

    @Column({ type: 'date', nullable: true })
    date: Date;

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;

    @Column({ nullable: true })
    imageUrl?: string;

    @ManyToOne(() => Organization, {
        nullable: false,
        eager: true,
    })
    organization: Organization;

    @Column({ default: false })
    isAllMember: boolean;
}

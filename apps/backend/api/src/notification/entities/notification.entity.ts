import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity } from 'typeorm';
import { DeliveryStatus } from '../enums/delivery-status.enum';
import type { NotificationChannel } from '../enums/notification-channel.enum';
import { NotificationStatus } from '../enums/notification-status.enum';

@Entity()
export class Notification extends BaseModel {
    @Column()
    reference: string;

    @Column({ default: NotificationStatus.Sent })
    status: NotificationStatus;

    @Column()
    channel: NotificationChannel;

    @Column({ default: 0 })
    numberOfAttempts: number;

    @Column({ nullable: true })
    error: string;

    @Column()
    to: string;

    @Column()
    content: string;

    @Column({ nullable: true })
    subject: string;

    @Column({ default: DeliveryStatus.Pending })
    deliveryStatus: DeliveryStatus;

    @Column({ nullable: true })
    deliveryResponse: string;
}

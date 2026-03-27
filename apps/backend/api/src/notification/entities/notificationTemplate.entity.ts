import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity } from 'typeorm';
import { NotificationChannel } from '../enums/notification-channel.enum';

@Entity()
export class NotificationTemplate extends BaseModel {
    @Column()
    channelType: NotificationChannel;

    @Column({ unique: true })
    templateName: string;

    @Column()
    subject: string;

    @Column({ type: 'text' })
    content: string;
}

import { BaseModel } from "src/Utilities/entities/base-model.entity";
import { Column, Entity } from "typeorm";
import { NotificationStatus } from "../enums/notification-status.enum";
import { NotificationChannel } from "../enums/notification-channel.enum";
import { DeliveryStatus } from "../enums/delivery-status.enum";

@Entity()
export class Notification extends BaseModel{

    @Column()
    reference: string;
    
    @Column()
    status: NotificationStatus;
    
    @Column()
    channel: NotificationChannel;
    
    @Column()
    numberOfAttempts: number;
    
    @Column()
    error: string;
    
    @Column()
    to: string;

    @Column()
    content: string;

    @Column()
    subject: string;
    
    @Column()
    deliveryStatus: DeliveryStatus;
    
    @Column()
    deliveryResponse: string;
}

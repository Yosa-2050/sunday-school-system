import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationChannel } from './enums/notification-channel.enum';
import { NotificationStatus } from './enums/notification-status.enum';
import {
    type IEmailService,
    IEmailServiceInterface,
} from './interface/email-service.interface';

@Injectable()
export class NotificationService {
    private fromEmail = 'eyoelfikadu801@gmail.com';
    constructor(
        @Inject(IEmailServiceInterface)
        private readonly emailService: IEmailService,
        @InjectRepository(Notification)
        private notificationRepo: Repository<Notification>,
    ) {}

    send(req: CreateNotificationDto) {
        if (req.channel === NotificationChannel.Email) {
            this.emailService.sendEmail(
                this.fromEmail,
                req.to,
                req.subject,
                req.content,
            );
        }

        const notification = this.notificationRepo.create({
            channel: req.channel,
            numberOfAttempts: 1,
            reference: req.reference,
            to: req.to,
            content: req.content,
            subject: req.subject,
            status: NotificationStatus.Sent,
        });

        this.notificationRepo.save(notification);
    }
}

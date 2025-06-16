import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationTemplate } from './entities/notificationTemplate.entity';
import { NotificationChannel } from './enums/notification-channel.enum';
import { NotificationStatus } from './enums/notification-status.enum';
import {
    type IEmailService,
    IEmailServiceInterface,
} from './interface/email-service.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
    private fromEmail = 'eyoelfikadu801@gmail.com';
    constructor(
        @Inject(IEmailServiceInterface)
        private readonly emailService: IEmailService,
        @InjectRepository(Notification)
        private notificationRepo: Repository<Notification>,
        @InjectRepository(NotificationTemplate)
        private notificationTemplateRepo: Repository<NotificationTemplate>,
        private readonly notificationGateway: NotificationGateway,
    ) {}

    send(req: CreateNotificationDto) {
        const notification = this.notificationRepo.create({
            channel: req.channel,
            numberOfAttempts: 1,
            reference: req.reference,
            to: req.to,
            content: req.content,
            subject: req.subject,
            status: NotificationStatus.Pending,
        });

        this.notificationRepo.save(notification);
        if (req.channel === NotificationChannel.Email) {
            this.emailService.sendEmail(
                this.fromEmail,
                req.to,
                req.subject,
                req.content,
            );
        }

        //send real time notification to all users or specific user
        if (
            req.channel === NotificationChannel.InApp &&
            req.isRealTimeNofitication
        ) {
            if (req.isNotifyToAllUser) {
                this.notificationGateway.sendNotificationToAllUsers({
                    title: req.subject,
                    message: req.content,
                });
            } else {
                this.notificationGateway.sendNotificationToSpecificUser(
                    req.reference,
                    {
                        title: req.subject,
                        message: req.content,
                    },
                );
            }
        }
    }

    async getUserInAppNotifications(userId: string) {
        return await this.notificationRepo.find({
            where: {
                reference: userId,
                channel: NotificationChannel.InApp,
            },
        });
    }

    async markNotificationAsRead(notificationId: string) {
        const notification = await this.notificationRepo.findOneBy({
            id: notificationId,
        });

        if (!notification) {
            throw new EntityNotFoundException('Notification');
        }

        const updatedNotification = await this.notificationRepo.update(
            { id: notificationId },
            { status: NotificationStatus.Read },
        );

        const result = UtilityServices.EnsureUpdated(
            updatedNotification,
            notificationId,
        );
        return result;
    }

    async getTemplate(
        templateName: string,
        contentValuesToReplace: Record<string, string>,
        subjectValuesToReplace: Record<string, string>,
    ) {
        const response = await this.notificationTemplateRepo.findOneBy({
            templateName,
        });
        let finalContent = response.content;
        let finalSubject = response.subject;

        // Replace placeholders
        if (contentValuesToReplace) {
            finalContent = this.replacePlaceholders(
                finalContent,
                contentValuesToReplace,
            );
        }

        if (subjectValuesToReplace) {
            finalSubject = this.replacePlaceholders(
                finalSubject,
                subjectValuesToReplace,
            );
        }

        const result = {
            content: finalContent,
            subject: finalSubject,
        };

        return result;
    }

    replacePlaceholders(
        template: string,
        valuesToReplace: Record<string, string>,
    ): string {
        return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
            return valuesToReplace[key] !== undefined
                ? valuesToReplace[key]
                : match;
        });
    }
}

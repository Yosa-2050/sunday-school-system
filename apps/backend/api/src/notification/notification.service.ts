import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { QueryBuilderService } from 'shared/query-builder.service';
import { entityParamDeserializer, entityParamSerializer } from 'shared/schema';
import { In, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationDetailsDto } from './dto/notification-details.dto';
import { Notification } from './entities/notification.entity';
import { NotificationTemplate } from './entities/notificationTemplate.entity';
import { MarkReadUnread } from './enums/mark-read-unread.enum';
import { NotificationChannel } from './enums/notification-channel.enum';
import { NotificationStatus } from './enums/notification-status.enum';
import {
    type IEmailService,
    IEmailServiceInterface,
} from './interface/email-service.interface';
// biome-ignore lint/style/useImportType: <explanation>
import {
    ISmsService,
    ISmsServiceInterface,
} from './interface/sms-service.interface';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
    private fromEmail = 'eyoelfikadu801@gmail.com';
    constructor(
        @Inject(IEmailServiceInterface)
        private readonly emailService: IEmailService,
        @Inject(ISmsServiceInterface)
        private readonly smsService: ISmsService,
        @Inject(ISmsServiceInterface)
        private readonly smsService: ISmsService,
        @InjectRepository(Notification)
        private notificationRepo: Repository<Notification>,
        @InjectRepository(NotificationTemplate)
        private notificationTemplateRepo: Repository<NotificationTemplate>,
        private readonly notificationGateway: NotificationGateway,
        private readonly queryBuilderService: QueryBuilderService,
    ) {}

    async sendUsingTemplate(
        detail: NotificationDetailsDto,
        isRealTime?: boolean,
        channel?: NotificationChannel,
    ) {
        const template = await this.notificationTemplateRepo.findBy({
            templateName: detail.templateName,
        });
        const notifications = [];
        if (channel === NotificationChannel.Email) {
            this.SaveAndSendEmail(template, detail, channel, notifications);
        }

        if (channel === NotificationChannel.Sms) {
            this.SaveAndSendEmail(template, detail, channel, notifications);
        }
    }

    private SaveAndSendEmail(
        template: NotificationTemplate[],
        detail: NotificationDetailsDto,
        channel: NotificationChannel,
        notifications: Notification[],
    ) {
        const emailTemplate = template.find(
            (x) => x.channelType === NotificationChannel.Email,
        );
        if (emailTemplate) {
            for (let index = 0; index < detail.toEmailAddress.length; index++) {
                const email = detail.toEmailAddress[index];

                const notification = this.notificationRepo.create({
                    channel: channel,
                    numberOfAttempts: 1,
                    reference: detail.referenceId,
                    to: email,
                    content: this.renderTemplate(
                        emailTemplate.content,
                        detail.metaData,
                    ),
                    subject: emailTemplate.subject,
                    status: NotificationStatus.Pending,
                });

                this.emailService.sendEmail(
                    this.fromEmail,
                    email,
                    emailTemplate.subject,
                    this.renderTemplate(emailTemplate.content, detail.metaData),
                );

                notifications.push(notification);
            }
        }

        const smsTemplate = template.find(
            (x) => x.channelType === NotificationChannel.Sms,
        );

        if (smsTemplate) {
            for (const phone of detail.toPhoneNumber) {
                const notification = this.notificationRepo.create({
                    channel,
                    numberOfAttempts: 1,
                    reference: detail.referenceId,
                    to: phone,
                    content: this.renderTemplate(
                        smsTemplate.content,
                        detail.metaData,
                    ),
                    subject: smsTemplate.subject,
                    status: NotificationStatus.Pending,
                });

                this.smsService.sendSms(
                    // smsTemplate.senderId ?? '',
                    phone,
                    this.renderTemplate(smsTemplate.content, detail.metaData),
                );

                notifications.push(notification);
            }
        }
    }

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

        if (req.channel === NotificationChannel.Sms) {
            this.smsService.sendSms(req.to, req.content);
        }

        //send real time notification to all users or specific user
        if (
            req.channel === NotificationChannel.InApp &&
            req.isRealTimeNotification
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

    sendBulk(reqs: CreateNotificationDto[]) {
        const bulkEmails: { to: string; subject: string; content: string }[] =
            [];
        const bulkSms: { to: string; content: string }[] = [];

        for (const req of reqs) {
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

            // if (req.channel === NotificationChannel.Email) {
            //     bulkEmails.push({
            //         to: req.to,
            //         subject: req.subject,
            //         content: req.content
            //     });
            // }

            if (req.channel === NotificationChannel.Sms) {
                bulkSms.push({
                    to: req.to,
                    content: req.content,
                });
            }
        }

        // if (bulkEmails.length > 0) {
        //     this.emailService.sendBulkEmail(this.fromEmail, bulkEmails);
        // }

        if (bulkSms.length > 0) {
            this.smsService.sendBulkSms(bulkSms);
        }
    }

    async getAllInAppNotifications(payload: string, userId: string) {
        const { p, pp } = entityParamDeserializer(payload);

        const deserialized = entityParamDeserializer(payload);

        const queryString = entityParamSerializer({
            ...deserialized,
            f: [
                { f: 'channel', v: NotificationChannel.InApp, o: 'eq' },
                { f: 'reference', v: userId, o: 'eq' },
                ...(deserialized.f ?? []),
            ],
            o: [{ f: 'createdAt', d: 'desc' }],
        });

        const searchableColumns = ['subject', 'content'];

        const { data: inAppNotifications, total } =
            await this.queryBuilderService.buildQuery(
                this.notificationRepo,
                queryString,
                [], // No joins needed for this query
                searchableColumns,
            );
        const [, count] = await this.notificationRepo.findAndCountBy({
            channel: NotificationChannel.InApp,
            reference: userId,
            status: NotificationStatus.Pending,
        });

        return {
            ...new PaginatedResponseDto<Notification[]>(
                inAppNotifications,
                total,
                p,
                pp,
            ),
            count,
        };
    }

    async getUserInAppNotifications(userId: string) {
        return await this.notificationRepo.find({
            where: {
                reference: userId,
                channel: NotificationChannel.InApp,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async markNotificationAsReadOrUnRead(
        notificationId: string,
        action: string,
    ) {
        const notification = await this.notificationRepo.findOneBy({
            id: notificationId,
        });

        if (!notification) {
            throw new EntityNotFoundException('Notification');
        }

        let statusToUpdate = null;

        if (action === MarkReadUnread.MARK_AS_READ) {
            statusToUpdate = NotificationStatus.Read;
        } else {
            statusToUpdate = NotificationStatus.Pending;
        }

        const updatedNotification = await this.notificationRepo.update(
            { id: notificationId },
            { status: statusToUpdate },
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

    async markMultipleAsReadUnread(
        referenceId: string,
        list: string[],
        status: MarkReadUnread,
    ) {
        const updatedNotification = await this.notificationRepo.update(
            { reference: referenceId, id: In(list) },
            {
                status:
                    status === MarkReadUnread.MARK_AS_READ
                        ? NotificationStatus.Read
                        : NotificationStatus.Pending,
            },
        );

        const result = UtilityServices.EnsureUpdated(
            updatedNotification,
            referenceId,
        );
        return result;
    }
    async markAllAsReadUnread(referenceId: string, status: MarkReadUnread) {
        const updatedNotification = await this.notificationRepo.update(
            { reference: referenceId },
            {
                status:
                    status === MarkReadUnread.MARK_AS_READ
                        ? NotificationStatus.Read
                        : NotificationStatus.Pending,
            },
        );

        const result = UtilityServices.EnsureUpdated(
            updatedNotification,
            referenceId,
        );
        return result;
    }

    renderTemplate(template: string, metadata: Record<string, string>): string {
        return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
            return metadata[key] ?? `{{${key}}}`; // if not found, keep placeholder
        });
    }
}

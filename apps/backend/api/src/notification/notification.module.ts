import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationTemplate } from './entities/notificationTemplate.entity';
import { IEmailServiceInterface } from './interface/email-service.interface';
import { ResendImpl } from './interface/implementations/resend.impl';
import { NotificationTemplateSeedService } from './notification-template-seed.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';

@Module({
    imports: [TypeOrmModule.forFeature([Notification, NotificationTemplate])],
    controllers: [NotificationController],
    providers: [
        NotificationService,
        {
            provide: IEmailServiceInterface,
            useClass: ResendImpl,
        },
        NotificationTemplateSeedService,
        NotificationGateway,
    ],
    exports: [NotificationService, NotificationTemplateSeedService],
})
export class NotificationModule {
    constructor(
        private readonly notificationTemplateSeedService: NotificationTemplateSeedService,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.notificationTemplateSeedService.seedNotiificationTemplateData();
    }
}

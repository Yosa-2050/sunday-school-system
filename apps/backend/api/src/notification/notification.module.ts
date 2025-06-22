import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notes } from './entities/notes.entity';
import { Notification } from './entities/notification.entity';
import { NotificationTemplate } from './entities/notificationTemplate.entity';
import { IEmailServiceInterface } from './interface/email-service.interface';
import { ResendImpl } from './interface/implementations/resend.impl';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NotificationTemplateSeedService } from './notification-template-seed.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification, NotificationTemplate, Notes]),
    ],
    controllers: [NotificationController, NotesController],
    providers: [
        NotificationService,
        {
            provide: IEmailServiceInterface,
            useClass: ResendImpl,
        },
        NotificationTemplateSeedService,
        NotificationGateway,
        NotesService,
    ],
    exports: [
        NotificationService,
        NotificationTemplateSeedService,
        NotesService,
    ],
})
export class NotificationModule {
    constructor(
        private readonly notificationTemplateSeedService: NotificationTemplateSeedService,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.notificationTemplateSeedService.seedNotiificationTemplateData();
    }
}

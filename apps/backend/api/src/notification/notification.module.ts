import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { IEmailServiceInterface } from './interface/email-service.interface';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ResendImpl } from './interface/implementations/resend.impl';

@Module({
    imports: [TypeOrmModule.forFeature([Notification])],
    controllers: [NotificationController],
    providers: [
        NotificationService,
        {
            provide: IEmailServiceInterface,
            useClass: ResendImpl,
        },
    ],
    exports: [NotificationService],
})
export class NotificationModule {}

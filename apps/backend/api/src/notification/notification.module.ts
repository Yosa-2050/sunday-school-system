import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { IEmailServiceInterface } from './interface/email-service.interface';
import { NodeMailImpl } from './interface/implementations/node-mailer.impl';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
    imports: [TypeOrmModule.forFeature([Notification])],
    controllers: [NotificationController],
    providers: [
        NotificationService,
        {
            provide: IEmailServiceInterface,
            useClass: NodeMailImpl,
        },
    ],
    exports: [NotificationService],
})
export class NotificationModule {}

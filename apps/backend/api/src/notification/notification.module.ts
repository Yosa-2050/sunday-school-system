import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { NodeMailImpl } from "./interface/implementations/node-mailer.impl";
import { IEmailServiceInterface as IEmailServiceInterface } from "./interface/email-service.interface";
import { Notification } from "./entities/notification.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Notification
    ]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService, 
    {
      provide: IEmailServiceInterface,
      useClass: NodeMailImpl
    }],
    exports: [NotificationService]
})
export class NotificationModule {}

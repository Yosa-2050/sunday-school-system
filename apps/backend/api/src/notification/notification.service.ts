import { Inject, Injectable } from "@nestjs/common";
import { IEmailService, IEmailServiceInterface } from "./interface/email-service.interface";
import { NotificationChannel } from "./enums/notification-channel.enum";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Notification } from "./entities/notification.entity";
import { Repository } from "typeorm";
import { NotificationStatus } from "./enums/notification-status.enum";

@Injectable()
export class NotificationService {

  private fromEmail = "eyoelfikadu801@gmail.com";
  constructor(@Inject(IEmailServiceInterface) private readonly emailService: IEmailService,
  @InjectRepository(Notification) private notificationRepo: Repository<Notification>,){}

  async send(req: CreateNotificationDto){
    if(req.channel == NotificationChannel.Email)
    {
      this.emailService.sendEmail(this.fromEmail, req.to, req.subject, req.content);
    }
    else{

    }

    var notification = this.notificationRepo.create({
      channel: req.channel,
      numberOfAttempts: 1,
      reference: req.reference,
      to: req.to,
      content: req.content,
      subject: req.subject,
      status: NotificationStatus.Sent
    });

    this.notificationRepo.save(notification);
  }
}

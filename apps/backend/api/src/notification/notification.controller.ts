import {
  Body,
  Controller,
  Post,
} from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Public } from "src/auth/jwt-public";

@Public()
@ApiBearerAuth()
@ApiTags("notification")
@Controller("notification")
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Post()
  sendEmail(@Body() req: CreateNotificationDto) {
    return this.notificationService.send(req);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateNotificationDto } from './dto/create-notification.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from './notification.service';

@ApiBearerAuth()
@ApiTags('notification')
@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    sendEmail(@Body() req: CreateNotificationDto) {
        return this.notificationService.send(req);
    }
}

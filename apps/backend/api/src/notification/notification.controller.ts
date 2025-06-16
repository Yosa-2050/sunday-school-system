import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@shega/auth/jwt-public';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateNotificationDto } from './dto/create-notification.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from './notification.service';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Public()
    @Post()
    sendEmail(@Body() req: CreateNotificationDto) {
        return this.notificationService.send(req);
    }

    @Get('getUserInAppNotifications/:userId')
    getUserInAppNotifications(@Param('userId') userId: string) {
        return this.notificationService.getUserInAppNotifications(userId);
    }

    @Patch('markNotificationAsRead/:notificationId')
    markNotificationAsRead(@Param('notificationId') notificationId: string) {
        return this.notificationService.markNotificationAsRead(notificationId);
    }
}

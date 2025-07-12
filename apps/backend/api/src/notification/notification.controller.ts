import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
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

    @Post('getAllInAppNotifications')
    getAllInAppNotifications(@Body() dto: { q: string }, @Request() req) {
        return this.notificationService.getAllInAppNotifications(
            dto.q,
            CurrentUser.getUserId(req),
        );
    }

    @Get('getUserInAppNotifications')
    getUserInAppNotifications(@Request() req) {
        return this.notificationService.getUserInAppNotifications(
            CurrentUser.getUserId(req),
        );
    }

    @Patch('markNotificationAsRead/:notificationId')
    markNotificationAsRead(@Param('notificationId') notificationId: string) {
        return this.notificationService.markNotificationAsReadOrUnRead(
            notificationId,
            'MARK_AS_READ',
        );
    }

    @Patch('markNotificationAsUnRead/:notificationId')
    markNotificationAsUnRead(@Param('notificationId') notificationId: string) {
        return this.notificationService.markNotificationAsReadOrUnRead(
            notificationId,
            'MARK_AS_UNREAD',
        );
    }
}

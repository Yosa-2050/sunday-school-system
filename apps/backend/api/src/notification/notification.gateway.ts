import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// biome-ignore lint/style/useImportType: <explanation>
import { Server, Socket } from 'socket.io';
// biome-ignore lint/style/useImportType: <explanation>
import { InAppNotificationDto } from './dto/inApp-notification.dto';

@WebSocketGateway()
export class NotificationGateway {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId;
        if (userId) {
            client.join(`user_${userId}`);
        } else {
            client.disconnect(true);
        }
    }

    sendNotificationToAllUsers(notification: InAppNotificationDto) {
        this.server.emit('newNotification', notification);
    }

    sendNotificationToSpecificUser(
        userId: string,
        notification: InAppNotificationDto,
    ) {
        this.server.to(`user_${userId}`).emit('newNotification', notification);
    }
}

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InAppNotificationDto } from './dto/inApp-notification';

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

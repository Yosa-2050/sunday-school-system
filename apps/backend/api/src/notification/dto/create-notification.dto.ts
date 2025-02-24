import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { NotificationChannel } from '../enums/notification-channel.enum';

export class CreateNotificationDto {
    @ApiProperty()
    @IsEnum(NotificationChannel)
    channel: NotificationChannel;

    @ApiProperty()
    @IsString()
    to: string;

    @ApiProperty()
    @IsString()
    subject: string;

    @ApiProperty()
    @IsString()
    content: string;

    @ApiProperty()
    @IsString()
    reference: string;
}

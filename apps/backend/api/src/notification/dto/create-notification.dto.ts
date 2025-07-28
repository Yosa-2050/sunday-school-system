import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { NotificationChannel } from '../enums/notification-channel.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationType } from '../enums/notification-type.enum';

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

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isRealTimeNotification?: boolean = false;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isNotifyToAllUser?: boolean = false;

    metaData: Record<string, string>;

    type: NotificationType;
}

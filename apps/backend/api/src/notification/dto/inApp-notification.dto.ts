import { IsString } from 'class-validator';

export class InAppNotificationDto {
    @IsString()
    title: string;

    @IsString()
    message: string;
}

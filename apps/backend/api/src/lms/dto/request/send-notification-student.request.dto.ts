import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class SendStudentNotificationDto {
    @ApiProperty()
    @IsString()
    text: string;

    @ApiProperty()
    @IsArray()
    list: string[];
}

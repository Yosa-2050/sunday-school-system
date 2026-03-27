import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@shega/events/enum/event-type.enum';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventRequestDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsEnum(EventType)
    @IsNotEmpty()
    type: EventType;

    @ApiProperty()
    @IsString()
    location: string;

    @ApiProperty()
    @IsDateString()
    date: string;

    @ApiProperty()
    @IsString()
    startTime: string;

    @ApiProperty()
    @IsString()
    endTime: string;
}

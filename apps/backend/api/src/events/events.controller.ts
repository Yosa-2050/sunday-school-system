import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Request,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
import { CreateEventAttendanceDto } from '@shega/attendance/dto/request/create-event-attendance.dto';
import { Express } from 'express';
import { CreateEventRequestDto } from './dto/request/create-event.request.dto';
import { Event } from './entity/event.entity';
import { EventsService } from './events.service';

@ApiBearerAuth()
@ApiTags('events')
@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post('create')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    create(
        @Body() dto: CreateEventRequestDto,
        @UploadedFile() file: Express.Multer.File,
        @Request() user,
    ) {
        return this.eventsService.create(
            dto,
            CurrentUser.getOrganizationId(user, true),
            file,
        );
    }

    @Post('create-attendance/:eventId')
    createAttendance(
        @Param('eventId') eventId: string,
        @Body() dto: CreateEventAttendanceDto,
    ) {
        return this.eventsService.createAttendance(eventId, dto);
    }

    @Get(':eventId/attendances')
    getEventAttendances(@Param('eventId') referenceId: string) {
        return this.eventsService.getEventAttendances(referenceId);
    }

    @Get()
    findAll(@Request() user) {
        return this.eventsService.findAll(
            CurrentUser.getOrganizationId(user, true),
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateData: Partial<Event>,
    ): Promise<Event> {
        return this.eventsService.update(id, updateData);
    }
}

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { HomeRoomAssignmentDto } from '../dto/request/home-room.request.dto';
import { HomeRoomService } from '../services/home-room.service';

@Controller('home-room')
export class HomeRoomController {
    constructor(private readonly homeRoomService: HomeRoomService) {}

    @Post()
    create(@Body() dto: HomeRoomAssignmentDto) {
        return this.homeRoomService.CreateHomeRoom(dto);
    }

    @Get('byCalendarId/:calendarYearId')
    findClassesByCalendarId(
        @Param('calendarYearId', new ParseUUIDPipe()) yearId: string,
    ) {
        return this.homeRoomService.findClassesByCalendarId(yearId);
    }

    @Patch()
    update(@Body() dto: HomeRoomAssignmentDto) {
        return this.homeRoomService.UpdateHomeRoom(dto);
    }

    @Delete()
    delete(@Body() dto: HomeRoomAssignmentDto) {
        //return this.homeRoomService.DeleteHomeRoom(dto);
    }
}

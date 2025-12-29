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
// biome-ignore lint/style/useImportType: <explanation>
import { HomeRoomAssignmentDto } from '../dto/request/home-room.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
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

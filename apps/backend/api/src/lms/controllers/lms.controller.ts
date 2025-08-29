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
import { Public } from '@shega/auth/jwt-public';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateUsingNameRequestDto } from '@shega/job_portal/dto/request/create-name.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateCalendarYearRequestDto } from '../dto/request/create-calendar-year.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateLmDto } from '../dto/request/update-lm.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassService } from '../services/class.service';
// biome-ignore lint/style/useImportType: <explanation>
import { LmsService } from '../services/lms.service';

@Public()
@Controller('lms')
export class LmsController {
    constructor(
        private readonly lmsService: LmsService,
        private readonly classService: ClassService,
    ) {}

    @Post('calendarYear/:programId')
    create(
        @Body() dto: CreateCalendarYearRequestDto,
        @Param('programId', new ParseUUIDPipe()) id: string,
    ) {
        return this.lmsService.createCalendarYear(id, dto);
    }

    @Get('calendarYear/:programId')
    findAllCalendarId(@Param('programId', new ParseUUIDPipe()) id: string) {
        return this.lmsService.findAllYear(id);
    }

    @Get('calendarYearById/:id')
    findOne(@Param('id') id: string) {
        return this.lmsService.findOne(+id);
    }

    @Patch('calendarYear/:id')
    update(@Param('id') id: string, @Body() updateLmDto: UpdateLmDto) {
        return this.lmsService.update(+id, updateLmDto);
    }

    @Delete('calendarYear/:id')
    remove(@Param('id') id: string) {
        return this.lmsService.remove(+id);
    }

    @Post('program')
    createProgram(@Body() dto: CreateUsingNameRequestDto) {
        return this.lmsService.createProgram(dto.name);
    }

    @Get('program')
    getPrograms() {
        return this.lmsService.getProgram();
    }

    @Get('program/:id')
    findProgramById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.lmsService.findOneProgram(id);
    }
}

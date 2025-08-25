import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
} from '@nestjs/common';
import { Public } from '@shega/auth/jwt-public';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateUsingNameRequestDto } from '@shega/job_portal/dto/request/create-name.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassRequestDto } from '../dto/request/create-class.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassService } from '../services/class.service';

@Public()
@Controller('class')
export class ClassController {
    constructor(private readonly classService: ClassService) {}

    @Post('program')
    createProgram(@Body() dto: CreateUsingNameRequestDto) {
        return this.classService.createProgram(dto.name);
    }

    @Get('program')
    getPrograms() {
        return this.classService.getProgram();
    }

    @Get('program/:id')
    findProgramById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.classService.findOneProgram(id);
    }

    @Post('root')
    create(@Body() dto: ClassRequestDto) {
        return this.classService.create(dto, true);
    }

    @Get('root')
    findAllRoot() {
        return this.classService.findAll(true);
    }

    @Post('new/:id')
    addNew(
        @Body() dto: ClassRequestDto,
        @Param('id', new ParseUUIDPipe()) id: string,
    ) {
        return this.classService.create(dto, false, id);
    }

    @Get('main')
    findAll() {
        return this.classService.findAll(false);
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.classService.findOne(id);
    }

    @Get('sections/:id')
    findSections(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.classService.findSections(id);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateLmDto: UpdateLmDto) {
    //   return this.classService.update(+id, updateLmDto);
    // }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.classService.remove(+id);
    }
}

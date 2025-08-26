import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { StringRequestModel } from '@shega/Utilities/models/list-string.model';
import { Public } from '@shega/auth/jwt-public';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassRequestDto } from '../dto/request/create-class.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassService } from '../services/class.service';

@Public()
@Controller('class')
export class ClassController {
    constructor(private readonly classService: ClassService) {}

    @Post('root/:programId')
    create(
        @Body() dto: StringRequestModel,
        @Param('programId', new ParseUUIDPipe()) programId: string,
    ) {
        return this.classService.createRoot(dto.text, programId);
    }

    @Get('root/:programId')
    findAllRoot(@Param('programId', new ParseUUIDPipe()) programId: string) {
        return this.classService.findAllRootClass(programId);
    }

    @Post('main/:yearId')
    addNew(
        @Body() dto: ClassRequestDto,
        @Param('yearId', new ParseUUIDPipe()) yearId: string,
    ) {
        return this.classService.create(dto, yearId);
    }

    @Get('main/:yearId')
    findAll(@Param('yearId', new ParseUUIDPipe()) yearId: string) {
        return this.classService.findAll(yearId);
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

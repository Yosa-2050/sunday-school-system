import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateLmDto } from '../dto/request/create-lm.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateLmDto } from '../dto/request/update-lm.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { LmsService } from '../services/lms.service';

@Controller('lms')
export class LmsController {
    constructor(private readonly lmsService: LmsService) {}

    @Post()
    create(@Body() createLmDto: CreateLmDto) {
        return this.lmsService.create(createLmDto);
    }

    @Get()
    findAll() {
        return this.lmsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.lmsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateLmDto: UpdateLmDto) {
        return this.lmsService.update(+id, updateLmDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.lmsService.remove(+id);
    }
}

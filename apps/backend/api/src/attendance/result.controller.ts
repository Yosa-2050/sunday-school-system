import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@shega/auth/jwt-public';
// biome-ignore lint/style/useImportType: <explanation>
import {
    ResultForMultipleStudentRequestDto,
    ResultForSingleStudentRequestDto,
} from './dto/request/create-result.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ResultService } from './result.service';

@ApiBearerAuth()
@ApiTags('result')
@Controller('result')
@Public()
export class ResultController {
    constructor(private readonly resultService: ResultService) {}

    @Post()
    create(@Body() dto: ResultForSingleStudentRequestDto) {
        return this.resultService.create(dto);
    }

    @Post('multiple')
    createMultiple(@Body() dto: ResultForMultipleStudentRequestDto) {
        return this.resultService.createMultiple(dto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.resultService.findOne(id);
    }

    @Get('byTest/:testId')
    findByTest(@Param('testId') testId: string) {
        return this.resultService.findResultByTestId(testId);
    }

    @Get()
    findAll() {
        return this.resultService.findAll();
    }
}

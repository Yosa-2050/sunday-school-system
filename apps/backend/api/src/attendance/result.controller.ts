import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
import {
    ResultForMultipleStudentRequestDto,
    ResultForSingleStudentRequestDto,
} from './dto/request/create-result.request.dto';
import { GetResultRequestDto } from './dto/request/get-result.request.dto';
import { ResultService } from './result.service';

@ApiBearerAuth()
@ApiTags('result')
@Controller('result')
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

    @Post('getResults')
    findAll(@Body() dto: GetResultRequestDto, @Request() user) {
        return this.resultService.findAllResult(
            CurrentUser.getActiveYear(user, false),
            dto.classId,
            dto.subjectId,
            dto.testId,
        );
    }
}

import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Public } from '@shega/auth/jwt-public';
// biome-ignore lint/style/useImportType: <explanation>
import { Express } from 'express';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateStudentRequestDto } from '../dto/request/create-student.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { StudentService } from '../services/student.service';

@Public()
@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post('create')
    createEmployee(@Body() dto: CreateStudentRequestDto) {
        return this.studentService.CreateStudentDetailed(dto);
    }

    @Post('import/:classId')
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
    async importUsers(
        @UploadedFile() file: Express.Multer.File,
        @Param('classId', new ParseUUIDPipe()) id: string,
    ) {
        return await this.studentService.importStudents(file, id);
    }

    @Get(':classId')
    findStudents(@Param('classId', new ParseUUIDPipe()) id: string) {
        return this.studentService.findStudents(id);
    }
}

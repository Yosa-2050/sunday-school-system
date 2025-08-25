import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '@shega/auth/jwt-public';
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
}

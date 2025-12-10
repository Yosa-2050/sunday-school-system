import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Request,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
// biome-ignore lint/style/useImportType: <explanation>
import { StringRequestModel } from '@shega/Utilities/models/list-string.model';
import { Roles } from '@shega/auth/decorators/roles.decorator';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { Express } from 'express';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateStudentRequestDto } from '../dto/request/create-student.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { SendStudentNotificationDto } from '../dto/request/send-notification-student.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { StudentService } from '../services/student.service';

@Roles(UserRoleType.SchoolAdmin)
@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post('create/:classId')
    createStudent(
        @Body() dto: CreateStudentRequestDto,
        @Request() req,
        @Param('classId', new ParseUUIDPipe()) id: string,
    ) {
        return this.studentService.CreateStudentDetailed(
            id,
            dto,
            CurrentUser.getActiveYear(req, false),
        );
    }

    @Post('sendNotification')
    SendNotification(@Body() dto: StringRequestModel) {
        return this.studentService.sendNotificationForAllStudent(
            dto.text,
            '',
            [],
            2,
        );
    }

    @Post('sendNotificationForStudent')
    SendNotificationForSelectedStudent(
        @Body() dto: SendStudentNotificationDto,
    ) {
        return this.studentService.sendNotificationForAllStudent(
            dto.text,
            '',
            dto.list,
            1,
        );
    }

    @Post('sendNotification/:classId')
    SendNotificationForClass(
        @Body() dto: StringRequestModel,
        @Param('classId', new ParseUUIDPipe()) classId: string,
    ) {
        return this.studentService.sendNotificationForAllStudent(
            dto.text,
            classId,
            [],
            0,
        );
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
        @Request() req,
    ) {
        return await this.studentService.importStudents(
            file,
            id,
            CurrentUser.getActiveYear(req, false),
        );
    }

    @Get('byClassId/:classId')
    findStudents(
        @Param('classId', new ParseUUIDPipe()) id: string,
        @Request() req,
    ) {
        return this.studentService.findStudents(
            id,
            CurrentUser.getActiveYear(req, false),
        );
    }

    @Get('byId/:id')
    findStudentsById(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Request() req,
    ) {
        return this.studentService.findStudentsById(id);
    }
}

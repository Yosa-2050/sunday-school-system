import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Request,
} from '@nestjs/common';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
import { Roles } from '@shega/auth/decorators/roles.decorator';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateEmployeeDto } from '@shega/organization/dto/request/create-employee.dto';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { TeacherService } from '../services/teacher.service';

@Roles(UserRoleType.SchoolAdmin)
@Controller('teacher')
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) {}

    @Roles(UserRoleType.SchoolAdmin)
    @Post('create')
    createTeacher(
        @Body() dto: CreateEmployeeDto,
        @Request() req,
        @Param('classId', new ParseUUIDPipe()) id: string,
    ) {
        return this.teacherService.CreateTeacher(
            dto,
            CurrentUser.getActiveYear(req),
        );
    }

    @Get()
    findTeachers(
        @Param('classId', new ParseUUIDPipe()) id: string,
        @Request() req,
    ) {
        return this.teacherService.findTeachers(CurrentUser.getActiveYear(req));
    }

    @Get('/:id')
    findTeacherById(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Request() req,
    ) {
        return this.teacherService.findTeacherById(
            id,
            CurrentUser.getActiveYear(req),
        );
    }
}

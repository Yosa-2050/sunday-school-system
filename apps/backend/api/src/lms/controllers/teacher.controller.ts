import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
    Request,
} from '@nestjs/common';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
import { Roles } from '@shega/auth/decorators/roles.decorator';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateEmployeeDto } from '@shega/organization/dto/request/create-organization-member.dto';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { TeacherService } from '../services/teacher.service';

@Roles(UserRoleType.SchoolAdmin)
@Controller('teacher')
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) {}

    @Roles(UserRoleType.SchoolAdmin)
    @Post('create')
    createTeacher(@Body() dto: CreateEmployeeDto, @Request() req) {
        return this.teacherService.CreateTeacher(
            dto,
            CurrentUser.getActiveYear(req, false),
        );
    }

    @Roles(UserRoleType.SchoolAdmin)
    @Post('assign')
    assignTeachers(
        @Body()
        body: {
            calendarYearId: string;
            memberIds: string[];
        },
    ) {
        return this.teacherService.assignTeachers(
            body.calendarYearId,
            body.memberIds,
        );
    }

    @Roles(UserRoleType.SchoolAdmin)
    @Post('addExisting/:profileId')
    addExistingTeacher(
        @Param('profileId', new ParseUUIDPipe()) profileId: string,
        @Request() req,
    ) {
        return this.teacherService.addExistingTeacher(
            profileId,
            CurrentUser.getActiveYear(req),
        );
    }

    @Get()
    findTeachers(@Query('calendarYearId') calendarYearId: string) {
        return this.teacherService.findTeachers(calendarYearId);
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

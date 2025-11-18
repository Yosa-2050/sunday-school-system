import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Request,
} from '@nestjs/common';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
// biome-ignore lint/style/useImportType: <explanation>
import { StringRequestModel } from '@shega/Utilities/models/list-string.model';
import { Roles } from '@shega/auth/decorators/roles.decorator';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { AddSubjectAssignmentDto } from '../dto/request/add-subject-assignment.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { SubjectService } from '../services/subject.service';

@Roles(UserRoleType.SchoolAdmin)
@Controller('subject')
export class SubjectController {
    constructor(private readonly subjectService: SubjectService) {}

    @Post('root/:programId')
    create(
        @Body() dto: StringRequestModel,
        @Request() req,
        @Param('programId', new ParseUUIDPipe()) programId: string,
    ) {
        return this.subjectService.create(dto.text, programId);
    }

    @Patch('root/:id')
    update(
        @Body() dto: StringRequestModel,
        @Request() req,
        @Param('id', new ParseUUIDPipe()) id: string,
    ) {
        return this.subjectService.update(
            id,
            dto.text,
            CurrentUser.getProgramId(req),
        );
    }

    @Get('root/:programId')
    findAProgramRoot(
        @Request() req,
        @Param('programId', new ParseUUIDPipe()) programId: string,
    ) {
        return this.subjectService.findAllRootSubjects(programId);
    }

    @Post('assignSubject')
    assignSubject(@Body() dto: AddSubjectAssignmentDto, @Request() req) {
        return this.subjectService.assignSubject(
            dto,
            CurrentUser.getProgramId(req),
            CurrentUser.getActiveYear(req),
        );
    }

    @Patch('assignSubject/:id')
    updateAssignSubject(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: AddSubjectAssignmentDto,
        @Request() req,
    ) {
        return this.subjectService.updateSubjectAssignment(
            id,
            dto,
            CurrentUser.getProgramId(req),
            CurrentUser.getActiveYear(req),
        );
    }

    @Get('assigned/:classId')
    findSubjects(
        @Request() req,
        @Param('classId', new ParseUUIDPipe()) classId: string,
    ) {
        return this.subjectService.getAssignedSubject(
            classId,
            CurrentUser.getActiveYear(req),
        );
    }

    @Get('teachers/:classId/:subjectId')
    findTeachers(
        @Request() req,
        @Param('classId', new ParseUUIDPipe()) classId: string,
        @Param('subjectId', new ParseUUIDPipe()) subjectId: string,
    ) {
        return this.subjectService.getAssignedTeachers(
            classId,
            subjectId,
            CurrentUser.getActiveYear(req),
        );
    }
}

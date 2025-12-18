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
import { Public } from '@shega/auth/jwt-public';
// biome-ignore lint/style/useImportType: <explanation>
import { AddSubjectAssignmentDto } from '../dto/request/add-subject-assignment.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { SubjectService } from '../services/subject.service';

// @Roles(UserRoleType.SchoolAdmin)
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
        @Param('programId', new ParseUUIDPipe()) programId: string,
    ) {
        return this.subjectService.findAllRootSubjects(programId);
    }

    @Public()
    @Get('assignment/:teacherId')
    findOneByTeacherId(
        @Request() req,
        @Param('teacherId', new ParseUUIDPipe()) teacherId: string,
    ) {
        return this.subjectService.findOneByTeacherId(teacherId);
    }

    //TODO: validate the program id
    @Post('assignSubject/:programId')
    assignSubject(
        @Body() dto: AddSubjectAssignmentDto,
        @Request() req,
        @Param('programId', new ParseUUIDPipe()) programId: string,
    ) {
        return this.subjectService.assignSubject(dto, programId);
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
            CurrentUser.getProgramId(req, false),
            CurrentUser.getActiveYear(req, false),
        );
    }

    @Get('assigned/:classId')
    findSubjects(
        @Request() req,
        @Param('classId', new ParseUUIDPipe()) classId: string,
    ) {
        return this.subjectService.getAssignedSubject(
            classId,
            //TODO: User different security mechanism
            CurrentUser.getActiveYear(req, false),
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

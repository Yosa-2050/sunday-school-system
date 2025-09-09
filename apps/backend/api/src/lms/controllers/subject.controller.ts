import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
// biome-ignore lint/style/useImportType: <explanation>
import { StringRequestModel } from '@shega/Utilities/models/list-string.model';
import { Roles } from '@shega/auth/decorators/roles.decorator';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { SubjectService } from '../services/subject.service';

@Roles(UserRoleType.SchoolAdmin)
@Controller('subject')
export class SubjectController {
    constructor(private readonly subjectService: SubjectService) {}

    @Post('root')
    create(@Body() dto: StringRequestModel, @Request() req) {
        return this.subjectService.create(
            dto.text,
            CurrentUser.getProgramId(req),
        );
    }

    @Get('root')
    findAProgramRoot(@Request() req) {
        return this.subjectService.findAllRootSubjects(
            CurrentUser.getProgramId(req),
        );
    }
}

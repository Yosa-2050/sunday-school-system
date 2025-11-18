import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Request,
} from '@nestjs/common';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
// biome-ignore lint/style/useImportType: <explanation>
import { StringRequestModel } from '@shega/Utilities/models/list-string.model';
import { Roles } from '@shega/auth/decorators/roles.decorator';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassRequestDto } from '../dto/request/create-class.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassService } from '../services/class.service';

@Controller('class')
export class ClassController {
    constructor(private readonly classService: ClassService) {}

    @Roles(UserRoleType.SuperAdmin)
    @Post('root/:programId')
    create(
        @Body() dto: StringRequestModel,
        @Param('programId', new ParseUUIDPipe()) programId: string,
    ) {
        return this.classService.createRoot(dto.text, programId);
    }

    @Roles(
        UserRoleType.SuperAdmin,
        UserRoleType.Administrator,
        UserRoleType.SchoolAdmin,
    )
    @Get('root/:programId')
    findAllRoot(@Param('programId', new ParseUUIDPipe()) programId: string) {
        return this.classService.findAllRootClass(programId);
    }

    @Roles(UserRoleType.SchoolAdmin)
    @Get('rootForOrg/:programId')
    findAllRootForOrg(
        @Param('programId', new ParseUUIDPipe()) programId: string,
        @Request() req,
    ) {
        return this.classService.findAllRootClass(
            programId,
            CurrentUser.getOrganizationId(req, true),
        );
    }

    @Roles(UserRoleType.SchoolAdmin)
    @Get('root')
    findAProgramRoot(@Request() req) {
        return this.classService.findAllRootClass(
            CurrentUser.getProgramId(req),
            CurrentUser.getOrganizationId(req),
        );
    }

    @Roles(UserRoleType.SchoolAdmin)
    @Post('main/:calendarYearId')
    addNew(
        @Body() dto: ClassRequestDto,
        @Param('calendarYearId', new ParseUUIDPipe()) calendarYearId: string,
        @Request() req,
    ) {
        return this.classService.create(dto, calendarYearId);
    }

    // @Roles(UserRoleType.SchoolAdmin)
    // @Get('main')
    // findAll(@Request() req) {
    //     return this.classService.findAll(CurrentUser.getActiveYear(req));
    // }

    @Roles(UserRoleType.SchoolAdmin)
    @Get('main/:calendarYearId')
    findAll(
        @Request() req,
        @Param('calendarYearId', new ParseUUIDPipe()) calendarYearId: string,
    ) {
        return this.classService.findAll(calendarYearId);
    }

    @Roles(UserRoleType.SchoolAdmin)
    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
        return this.classService.findOne(id, CurrentUser.getActiveYear(req));
    }

    @Get('sections/:id')
    findSections(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.classService.findSections(id);
    }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.classService.remove(+id);
    }
}

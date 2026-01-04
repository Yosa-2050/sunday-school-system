import {
    Body,
    Controller,
    Delete,
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
import { ClassRequestDto } from '../dto/request/create-class.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ProgramType } from '../enums/program-type.enums';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassService } from '../services/class.service';

@Controller('class')
export class ClassController {
    constructor(private readonly classService: ClassService) {}

    @Roles(UserRoleType.SuperAdmin)
    @Post('root/:programType')
    create(
        @Body() dto: StringRequestModel,
        @Param('programType') programType: ProgramType,
    ) {
        return this.classService.createRoot(dto.text, programType);
    }

    @Roles(UserRoleType.SchoolAdmin)
    @Patch('main/:id')
    update(
        @Body() dto: ClassRequestDto,
        @Request() req,
        @Param('id', new ParseUUIDPipe()) id: string,
    ) {
        return this.classService.update(
            id,
            dto,
            CurrentUser.getProgramId(req, false),
        );
    }

    @Roles(UserRoleType.SuperAdmin, UserRoleType.Administrator)
    @Get('root/:programType')
    findAllRoot(@Param('programType') programType: ProgramType) {
        return this.classService.findAllRootClassByType(programType);
    }

    @Roles(UserRoleType.ProgramAdmin)
    @Get('root')
    findAllRootByProgram(@Request() req) {
        return this.classService.findAllRootClassByProgram(
            CurrentUser.getProgramId(req),
            CurrentUser.getOrganizationId(req),
        );
    }

    @Roles(UserRoleType.SchoolAdmin)
    @Get('rootForOrg/:programId')
    findAllRootForOrg(
        @Param('programId', new ParseUUIDPipe()) programId: string,
        @Request() req,
    ) {
        return this.classService.findAllRootClassByProgram(
            programId,
            CurrentUser.getOrganizationId(req, true),
        );
    }

    @Roles(UserRoleType.SchoolAdmin)
    @Get('root')
    findAProgramRoot(@Request() req) {
        return this.classService.findAllRootClassByProgram(
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

    //TODO
    @Roles(
        UserRoleType.SchoolAdmin,
        UserRoleType.Teacher,
        UserRoleType.Administrator,
        UserRoleType.SuperAdmin,
        UserRoleType.HomeRoom,
    )
    @Get('main/:calendarYearId')
    async findAll(
        @Param('calendarYearId', new ParseUUIDPipe()) calendarYearId: string,
        @Request() req,
    ) {
        const classes = await this.classService.findAll(calendarYearId);

        if (
            CurrentUser.getRole(req).toLowerCase() ===
            UserRoleType.SchoolAdmin.toLowerCase()
        ) {
            return classes;
        }
        return classes?.filter((x) =>
            CurrentUser.getClasses(req)?.includes(x.id),
        );
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

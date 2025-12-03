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
import { Roles } from '@shega/auth/decorators/roles.decorator';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateOrganizationUserDto } from '@shega/organization/dto/request/create-organization-member.dto';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateCalendarYearRequestDto } from '../dto/request/create-calendar-year.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateProgramDto } from '../dto/request/create-program-type.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateLmDto } from '../dto/request/update-lm.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { LmsService } from '../services/lms.service';

@Roles(UserRoleType.SuperAdmin)
@Controller('lms')
export class LmsController {
    constructor(private readonly lmsService: LmsService) {}

    @Post('calendarYear/:programId')
    create(
        @Body() dto: CreateCalendarYearRequestDto,
        @Param('programId', new ParseUUIDPipe()) id: string,
    ) {
        return this.lmsService.createCalendarYear(id, dto);
    }

    @Get('calendarYear/:programId')
    findAllCalendarId(@Param('programId', new ParseUUIDPipe()) id: string) {
        return this.lmsService.findAllYear(id);
    }

    @Roles(UserRoleType.SchoolAdmin)
    @Get('calendarYearForOrg/:programId')
    findAllCalendarIdForOrg(
        @Param('programId', new ParseUUIDPipe()) id: string,
        @Request() req,
    ) {
        return this.lmsService.findAllYear(
            id,
            CurrentUser.getOrganizationId(req, true),
        );
    }

    @Get('calendarYearById/:id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.lmsService.findOne(+id);
    }

    @Roles(UserRoleType.SchoolAdmin)
    @Get('calendarYear')
    getDefaultCalendarYear(@Request() req) {
        return this.lmsService.findAllYear(
            CurrentUser.getProgramId(req),
            CurrentUser.getOrganizationId(req, true),
        );
    }
    //TODO: Implement inactive calendar year
    @Patch('calendarYear/:id')
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateLmDto: UpdateLmDto,
    ) {
        return this.lmsService.update(+id, updateLmDto);
    }

    @Delete('calendarYear/:id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.lmsService.remove(+id);
    }

    @Post('program/:organizationId')
    createProgram(
        @Param('organizationId', new ParseUUIDPipe()) organizationId: string,
        @Body() dto: CreateProgramDto,
    ) {
        return this.lmsService.createProgram(dto, organizationId);
    }

    @Patch('program/:programId')
    updateProgram(
        @Param('programId', new ParseUUIDPipe()) programId: string,
        @Body() dto: CreateProgramDto,
    ) {
        return this.lmsService.updateProgram(programId, dto);
    }

    @Delete('program/:programId')
    deleteProgram(@Param('programID', new ParseUUIDPipe()) programId: string) {
        return this.lmsService.deleteProgram(programId);
    }

    @Roles(UserRoleType.SchoolAdmin)
    @Get('program/ForOrganization')
    getProgramsForOrganization(@Request() req) {
        return this.lmsService.getProgram(
            CurrentUser.getOrganizationId(req, true),
        );
    }

    @Get('program/byOrganization/:organizationId')
    getPrograms(
        @Param('organizationId', new ParseUUIDPipe()) organizationId: string,
    ) {
        return this.lmsService.getProgram(organizationId);
    }

    @Roles(UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin)
    @Get('program/:id')
    findProgramById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.lmsService.findOneProgram(id);
    }

    @Roles(UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin)
    @Post('user/:programId')
    createUser(
        @Body() dto: CreateOrganizationUserDto,
        @Param('programId', new ParseUUIDPipe()) programId: string,
        @Request() req,
    ) {
        return this.lmsService.CreateUserQDE(
            CurrentUser.getOrganizationId(req, true),
            programId,
            dto,
        );
    }

    @Roles(UserRoleType.SchoolAdmin)
    @Patch('assignUser/:programId/:userId')
    assignUser(
        @Param('userId', new ParseUUIDPipe()) userId: string,
        @Param('programId', new ParseUUIDPipe()) programId: string,
        @Request() req,
    ) {
        return this.lmsService.AssignUser(
            CurrentUser.getOrganizationId(req, true),
            programId,
            userId,
        );
    }

    @Roles(UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin)
    @Get('users/:programId')
    getUser(
        @Param('programId', new ParseUUIDPipe()) programId: string,
        @Request() req,
    ) {
        return this.lmsService.GetUsers(
            CurrentUser.getOrganizationId(req, true),
            programId,
        );
    }
}

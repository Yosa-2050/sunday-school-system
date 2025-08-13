import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { StringRequestModel } from '@shega/Utilities/models/list-string.model';
import { Roles } from '@shega/auth/decorators/roles.decorator';
// biome-ignore lint/style/useImportType: <explanation>
import { DocumentService } from '@shega/document/document.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateBasicUserDto } from '@shega/users/dto/create-user.dto';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateMentorShipProgramRequestDto } from './dto/request/create-mentorship.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateMentorShipProgramDto } from './dto/request/update-mentorship-program.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { MentorshipService } from './mentorship.service';

@ApiTags('mentorship')
@Controller('mentorship')
export class MentorshipController {
    constructor(
        private mentorshipService: MentorshipService,
        private documentService: DocumentService,
    ) {}

    @Roles(UserRoleType.Administrator, UserRoleType.SuperAdmin)
    @Post('newUser')
    createNewUser(@Body() dto: CreateBasicUserDto) {
        return this.mentorshipService.createMentor(dto);
    }

    @Roles(UserRoleType.Mentor)
    @Post()
    create(@Request() req, @Body() dto: CreateMentorShipProgramRequestDto) {
        return this.mentorshipService.create(CurrentUser.getMentorId(req), dto);
    }

    @Roles(UserRoleType.Administrator, UserRoleType.SuperAdmin)
    @Post('/allMentors')
    findAllMentors(@Body() dto: { q: string }) {
        return this.mentorshipService.findAllPaginated(dto.q);
    }

    @Roles(UserRoleType.Mentor)
    @Post('/allPrograms')
    findAllPrograms(
        @Request() req,
        @Body() dto: { q: string },
        @Query('published') published: boolean,
    ) {
        return this.mentorshipService.getAllByMentorPaginated(
            dto.q,
            CurrentUser.getMentorId(req),
            published === undefined ? null : !published,
            published,
        );
    }

    @Roles(UserRoleType.Administrator, UserRoleType.SuperAdmin)
    @Patch('approve/:id')
    approveOrganization(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.mentorshipService.approve(id, ApprovalType.Approved);
    }

    @Roles(UserRoleType.Administrator, UserRoleType.SuperAdmin)
    @Patch('decline/:id')
    declineOrganization(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: StringRequestModel,
    ) {
        return this.mentorshipService.approve(
            id,
            ApprovalType.Declined,
            dto?.note,
        );
    }

    @Roles(UserRoleType.Administrator, UserRoleType.SuperAdmin)
    @Post('listByAdmin')
    getAllByStatus(@Body() dto: { q: string }) {
        return this.mentorshipService.getAllByMentorPaginated(
            dto.q,
            null,
            false,
            true,
        );
    }

    @Get('program/:id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.mentorshipService.findOneByProgramId(id);
    }

    @Roles(UserRoleType.Mentor)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateMentorShipProgramDto,
        @Request() req,
    ) {
        return this.mentorshipService.update(
            id,
            dto,
            CurrentUser.getMentorId(req),
        );
    }

    @Roles(UserRoleType.Mentor)
    @Delete(':id')
    deletePostedJob(@Param('id') id: string, @Request() req) {
        return this.mentorshipService.remove(id, CurrentUser.getMentorId(req));
    }
}

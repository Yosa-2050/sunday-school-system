import {
    Body,
    Controller,
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
import { MentorshipService } from './mentorship.service';

@Roles(UserRoleType.Mentor)
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
            !published,
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
    @Post('byStatus')
    getAllByStatus(@Body() dto: { q: string }) {
        return this.mentorshipService.getByStatusPaginated(dto.q);
    }

    // @Roles(UserRoleType.Administrator, UserRoleType.SuperAdmin)
    // @Post('byStatus/export')
    // async exportByStatus(@Res() res: Response, @Body() dto: { q: string }) {
    //     const data = await this.mentorshipService.getByStatusPaginated(
    //         dto.q,
    //         null,
    //         true,
    //     );
    //     this.documentService.generateCsv(data.data, res, 'jobList');
    // }

    // @Roles(UserRoleType.Administrator, UserRoleType.SuperAdmin)
    // @Post('byStatus/exportSelected')
    // async exportSelected(
    //     @Res() res: Response,
    //     @Body() dto: ExportWithQuesryRequestModel,
    // ) {
    //     let data = [];

    //     if (dto.list?.length > 0) {
    //         data = await this.mentorshipService.getByList(dto.list);
    //     } else {
    //         data = (
    //             await this.mentorshipService.getByStatusPaginated(
    //                 dto.q,
    //                 null,
    //                 true,
    //             )
    //         ).data;
    //     }

    //     this.documentService.generateCsv(data, res, 'jobList');
    // }

    // @Roles(UserRoleType.Mentor)
    // @Post('byProvider')
    // getAllPostedJobsByPorvider(@Request() req, @Body() dto: { q: string }) {
    //     return this.mentorshipService.getByStatusAndByMentorPaginated(
    //         CurrentUser.getOrganizationId(req),
    //         dto.q,
    //         null,
    //         true,
    //     );
    // }

    // @Roles(UserRoleType.Mentor)
    // @Post('byProvider/draft')
    // getAllDraftJobsByPorvider(@Request() req, @Body() dto: { q: string }) {
    //     return this.mentorshipService.getByStatusAndByMentorPaginated(
    //         CurrentUser.getOrganizationId(req),
    //         dto.q,
    //         true,
    //     );
    // }

    // @Get(':id')
    // findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    //     return this.mentorshipService.findOne(id);
    // }

    // @Roles(UserRoleType.WorkProvider)
    // @Patch(':id')
    // update(
    //     @Param('id') id: string,
    //     @Body() updateJobPortalDto: UpdateJobPortalDto,
    //     @Request() req,
    // ) {
    //     return this.mentorshipService.update(
    //         id,
    //         updateJobPortalDto,
    //         CurrentUser.getOrganizationId(req),
    //     );
    // }
}

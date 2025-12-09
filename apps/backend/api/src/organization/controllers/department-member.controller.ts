import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Request,
} from '@nestjs/common';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
// biome-ignore lint/style/useImportType: <explanation>
import { AssignMemberDto } from '../dto/request/assign-member-to-department.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { DepartmentMembersDto } from '../dto/request/department-members.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { DepartmentMemberService } from '../services/department-member.service';

@Controller('departmentMember')
export class DepartmentMemberController {
    constructor(
        private readonly departmentMemberService: DepartmentMemberService,
    ) {}

    @Post()
    create(@Body() dto: AssignMemberDto, @Request() req) {
        return this.departmentMemberService.assignMember(
            CurrentUser.getOrganizationId(req, true),
            dto,
        );
    }

    @Get()
    findAll(@Query() query: DepartmentMembersDto, @Request() req) {
        return this.departmentMemberService.findAll(
            CurrentUser.getOrganizationId(req, true),
            query.departmentId,
            query.subDepartmentId,
        );
    }

    @Get('id/:departmentId')
    findByDepartmentId(
        @Param('departmentId') departmentId: string,
        @Request() req,
    ) {
        return this.departmentMemberService.findByDepartmentId(
            CurrentUser.getOrganizationId(req, true),
            departmentId,
        );
    }
}

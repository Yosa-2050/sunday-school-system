import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Public } from '@shega/auth/jwt-public';
// biome-ignore lint/style/useImportType: <explanation>
import { AssignMemberDto } from '../dto/request/assign-member-to-department.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { DepartmentMembersDto } from '../dto/request/department-members.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { DepartmentMemberService } from '../services/department-member.service';

@Public()
@Controller('departmentMember')
export class DepartmentMemberController {
    constructor(
        private readonly departmentMemberService: DepartmentMemberService,
    ) {}

    @Post()
    create(@Body() dto: AssignMemberDto) {
        return this.departmentMemberService.assignMember(dto);
    }

    @Get()
    findAll(@Query() query: DepartmentMembersDto) {
        return this.departmentMemberService.findAll(
            query.departmentId,
            query.subDepartmentId,
        );
    }

    @Get('id/:departmentId')
    findByDepartmentId(@Param('departmentId') departmentId: string) {
        return this.departmentMemberService.findByDepartmentId(departmentId);
    }
}

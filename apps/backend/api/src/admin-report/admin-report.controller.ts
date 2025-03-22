import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '@shega/auth/decorators/roles.decorator';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
import type { AdminReportService } from './admin-report.service';

@ApiTags('admin-report')
@Controller('admin-report')
export class AdminReportController {
    constructor(private readonly adminReportService: AdminReportService) {}

    @Roles(UserRoleType.Administrator)
    @Get('getCountTotals')
    async getCountTotals() {
        return await this.adminReportService.getCountTotals();
    }
}

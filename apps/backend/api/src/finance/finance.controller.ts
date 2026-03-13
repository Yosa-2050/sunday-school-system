import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { CreateMoneyRequestDto } from './dto/create-money-request.dto';
import { FinanceService } from './finance.service';

@ApiTags('finance')
@Controller('finance')
export class FinanceController {
    constructor(private readonly financeService: FinanceService) {}

    @Post('create')
    async create(@Body() dto: CreateMoneyRequestDto, @Req() req) {
        const report = await this.financeService.create(
            dto,
            req.user.id,
            req.user.email,
        );
        return { message: 'Request created successfully', data: report };
    }

    @Get()
    async findAll() {
        return await this.financeService.findAll();
    }

    @Get('by-role')
    findByRole(@Req() req) {
        return this.financeService.findByRole(req.user.id, req.user.role);
    }

    @Post('report-by-role')
    findReportsPaginatedByRole(
        @Body() dto: GetFinanceReportRequestDto,
        @Request() req,
    ) {
        return this.financeService.findByRolePaginated(
            req.user.id,
            req.user.role,
            dto.pagination,
        );
    }

    @Get('/:id')
    findOne(@Param('id') id: string) {
        return this.financeService.findById(id);
    }

    @Patch('/:id/status')
    reject(
        @Param('id') id: string,
        @Body('status') status: 'approved' | 'rejected' | 'under_review',
        @Body('reason') reason: string,
    ) {
        return this.financeService.updateStatus(id, status, reason);
    }
}

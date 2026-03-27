import { ReportResponseDto } from './report.response.dto';

export class PaginatedFinanceResponseDto {
    data: ReportResponseDto[];
    total: number;
    page: number;
    limit: number;

    constructor(
        data: ReportResponseDto[],
        total: number,
        page: number,
        limit: number,
    ) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.limit = limit;
    }
}

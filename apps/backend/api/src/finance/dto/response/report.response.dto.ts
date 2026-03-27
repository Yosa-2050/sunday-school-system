import { ReportItem } from '@shega/finance/entity/report-item.entity';
import { Report } from '@shega/finance/entity/report.entity';
import { User } from '@shega/users/entities/user.entity';

export class ReportResponseDto {
    id: string;
    date: string;
    requestorName: string;
    department: string;
    status: string;
    items: ReportItem[];
    requestor: User;
    createdAt: Date;

    static fromEntity(report: Report): ReportResponseDto {
        const dto = new ReportResponseDto();

        dto.id = report.id;
        dto.date = report.date;
        dto.requestorName = report.requestorName;
        dto.department = report.department;
        dto.status = report.status;
        dto.items = report.items;
        dto.requestor = report.requestor;
        dto.createdAt = report.createdAt;

        return dto;
    }
}

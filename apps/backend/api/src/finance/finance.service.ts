import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { GetFinanceReportRequestDto } from '@shega/Utilities/models/paginated.request3';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
import { NotificationType } from '@shega/notification/enums/notification-type.enum';
import { NotificationService } from '@shega/notification/notification.service';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
import { UsersService } from '@shega/users/users.service';
import { Repository } from 'typeorm/repository/Repository';
import { CreateMoneyRequestDto } from './dto/create-money-request.dto';
import { PaginatedFinanceResponseDto } from './dto/response/paginated-finance-response.dto';
import { ReportResponseDto } from './dto/response/report.response.dto';
import { ReportItem } from './entity/report-item.entity';
import { Report } from './entity/report.entity';

@Injectable()
export class FinanceService {
    constructor(
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,
        @InjectRepository(ReportItem)
        private readonly reportItemRepository: Repository<ReportItem>,
        private readonly UserService: UsersService,
        private readonly notificationService: NotificationService,
    ) {}
    async create(dto: CreateMoneyRequestDto, id: string, email: string) {
        const request = this.reportRepository.create({
            ...dto,
            status: 'pending',
        });

        request.requestor = await this.UserService.findById(id);

        request.items = dto.items.map((x) => {
            return this.reportItemRepository.create({ ...x });
        });
        return await this.reportRepository.save(request);
    }

    async findById(id: string) {
        return await this.reportRepository.findOne({
            where: { id },
            relations: ['items'],
        });
    }

    async findAll() {
        return await this.reportRepository.find({ relations: ['items'] });
    }

    async findByRole(id: string, role: UserRoleType) {
        if (
            role === UserRoleType.SuperAdmin ||
            role === UserRoleType.FinanceAdmin ||
            role === UserRoleType.SchoolAdmin
        ) {
            return await this.reportRepository.find({
                relations: ['items', 'requestor'],
            });
        }
        return await this.reportRepository.find({
            where: { requestor: { id: id } },
            relations: ['items', 'requestor'],
        });
    }

    async findByRolePaginated(
        id: string,
        role: string,
        request: GetFinanceReportRequestDto,
    ): Promise<PaginatedFinanceResponseDto> {
        const queryBuilder = this.reportRepository
            .createQueryBuilder('report')
            .leftJoinAndSelect('report.items', 'items')
            .leftJoinAndSelect('report.requestor', 'requestor');
        const pagination = request.pagination;

        const normalizedAllRoles = role.toUpperCase();

        const isAdmin =
            normalizedAllRoles.includes('ADMINISTRATOR') ||
            normalizedAllRoles.includes('SUPER_ADMIN') ||
            normalizedAllRoles.includes('FINANCE_ADMIN') ||
            normalizedAllRoles.includes('SCHOOL_ADMIN');

        if (!isAdmin) {
            queryBuilder.andWhere('requestor.id = :id', { id });
        }

        if (pagination.search) {
            const search = `%${pagination.search}%`;

            queryBuilder.andWhere(
                `(report.requestorName ILIKE :search
        OR report.department ILIKE :search)`,
                { search },
            );
        }

        if (request.reportStatus) {
            queryBuilder.andWhere('report.status = :status', {
                status: request.reportStatus,
            });
        }

        if (request.startDate && request.endDate) {
            queryBuilder.andWhere(
                'report.date BETWEEN :startDate AND :endDate',
                {
                    startDate: request.startDate,
                    endDate: request.endDate,
                },
            );
        }

        queryBuilder
            .skip((pagination.page - 1) * pagination.limit)
            .take(pagination.limit)
            .orderBy('report.createdAt', 'DESC');

        const [items, total] = await queryBuilder.getManyAndCount();

        const data: ReportResponseDto[] = items.map((item) =>
            ReportResponseDto.fromEntity(item),
        );

        return new PaginatedFinanceResponseDto(
            data,
            total,
            pagination.page,
            pagination.limit,
        );
    }

    async updateStatus(id: string, status: string, reason) {
        let UpdatedStatus = status;
        if (status === 'approve') {
            UpdatedStatus = 'approved';
        } else if (status === 'reject') {
            UpdatedStatus = 'rejected';
        } else if (status === 'under_review') {
            UpdatedStatus = 'under_review';
        }

        await this.reportRepository.update(id, { status: UpdatedStatus });

        const report = await this.reportRepository.findOne({
            where: { id },
            relations: ['items', 'requestor'],
        });

        if (!report) {
            throw new NotFoundException(`Report with id ${id} not found`);
        }

        if (UpdatedStatus === 'approved') {
            await this.sendApprovedEmail(
                report.requestor.email,
                report.id,
                reason,
            );
        } else if (UpdatedStatus === 'rejected') {
            this.sendRejectedEmail(report.requestor.email, report.id, reason);
        } else if (UpdatedStatus === 'under_review') {
            this.sendUnderReviewEmail(
                report.requestor.email,
                report.id,
                reason,
            );
        }
        return report;
    }

    sendApprovedEmail(email: string, id: string, reason?: string) {
        return this.notificationService.send({
            channel: NotificationChannel.Email,
            subject: `APPROVED: Request #${id}`,
            content: `
            <p>Dear User,</p>
            <p>This is an official notification that your request (ID: <b>${id}</b>) has been formally <b>APPROVED</b> by the Finance Department.</p>
            <p><strong>Approval Details/Notes:</strong><br />
            ${reason || 'Standard approval processing.'}</p>
            <p>Our team is now initiating the disbursement process. Please allow 1-7 business days for the transaction to reflect in your account.</p>
            <p>Regards,<br />Finance Administration Team</p>
        `,
            to: email,
            reference: id,
            isRealTimeNotification: true,
            isNotifyToAllUser: false,
            type: NotificationType.User,
            metaData: {},
        });
    }

    sendRejectedEmail(email: string, id: string, reason: string) {
        return this.notificationService.send({
            channel: NotificationChannel.Email,
            subject: `REJECTED: Request #${id}`,
            content: `
            <p>Dear User,</p>
            <p>Please be advised that your request (ID: <b>${id}</b>) has been <b>REJECTED</b> following a formal review.</p>
            <p><strong>Reason for Rejection:</strong><br />
            ${reason}</p>
            <p>If you believe this decision was made in error, please contact the Finance Office with the reference ID provided above.</p>
            <p>Regards,<br />Finance Administration Team</p>
        `,
            to: email,
            reference: id,
            isRealTimeNotification: true,
            isNotifyToAllUser: false,
            type: NotificationType.User,
            metaData: {},
        });
    }

    sendUnderReviewEmail(email: string, id: string, reason: string) {
        return this.notificationService.send({
            channel: NotificationChannel.Email,
            subject: `PENDING REVIEW: Request #${id}`,
            content: `
            <p>Dear User,</p>
            <p>Your request (ID: <b>${id}</b>) is currently <b>UNDER REVIEW</b> by the Finance Department.</p>
            <p><strong>Reviewer Comments:</strong><br />
            ${reason}</p>
            <p>No further action is required from your side at this time. We will notify you immediately once a final determination has been reached.</p>
            <p>Regards,<br />Finance Administration Team</p>
        `,
            to: email,
            reference: id,
            isRealTimeNotification: true,
            isNotifyToAllUser: false,
            type: NotificationType.User,
            metaData: {},
        });
    }
}

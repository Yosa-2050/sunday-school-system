import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
// biome-ignore lint/style/useImportType: <explanation>
import { PaginationDto3 } from '@shega/Utilities/models/paginated.request3';
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

        request.requestor = await this.UserService.findByEmail(id);

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
            role === UserRoleType.Administrator ||
            role === UserRoleType.SuperAdmin
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
        role: UserRoleType,
        pagination: PaginationDto3,
    ): Promise<PaginatedFinanceResponseDto> {
        const queryBuilder = this.reportRepository
            .createQueryBuilder('report')
            .leftJoinAndSelect('report.items', 'items')
            .leftJoinAndSelect('report.requestor', 'requestor');

        const isAdmin =
            role === UserRoleType.Administrator ||
            role === UserRoleType.SuperAdmin;

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

        if (pagination.status) {
            queryBuilder.andWhere('report.status = :status', {
                status: pagination.status,
            });
        }

        if (pagination.startDate && pagination.endDate) {
            queryBuilder.andWhere(
                'report.date BETWEEN :startDate AND :endDate',
                {
                    startDate: pagination.startDate,
                    endDate: pagination.endDate,
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
        } else {
            this.sendRejectedEmail(report.requestor.email, report.id, reason);
        }
        return report;
    }

    sendApprovedEmail(email: string, id: string, reason?: string) {
        return this.notificationService.send({
            channel: NotificationChannel.Email,
            subject: 'Request Approved',
            content: `Your request has been approved. ${reason}`,
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
            subject: 'Request Rejected',
            content: `Your request has been rejected. ${reason}`,
            to: email,
            reference: id,
            isRealTimeNotification: true,
            isNotifyToAllUser: false,
            type: NotificationType.User,
            metaData: {},
        });
    }
}

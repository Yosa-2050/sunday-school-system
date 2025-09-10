import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '@shega/organization/entities/organization.entity';
import { User } from '@shega/users/entities/user.entity';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
import { CountTotalsResponseDto } from './dtos/response/count-totals.response.dto';
import { GetRecentRegisteredUsersResponseDto } from './dtos/response/get-recent-registered-users.response.dto';

@Injectable()
export class AdminReportService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Organization)
        private organizationRepo: Repository<Organization>,
    ) {}

    async getCountTotals(): Promise<CountTotalsResponseDto> {
        const response = new CountTotalsResponseDto();
        response.totalRegisteredUsers = await this.userRepo.count();
        response.totalRegisteredEmployer = await this.organizationRepo.count();
        response.totalRegisteredAdmin =
            (await this.getCountUserByRole(UserRoleType.Administrator)) +
            (await this.getCountUserByRole(UserRoleType.SuperAdmin));

        return response;
    }

    async getCountUserByRole(roleType: UserRoleType): Promise<number> {
        return await this.userRepo
            .createQueryBuilder('user')
            .leftJoin('user.roles', 'userRoles')
            .where('userRoles.role = :role', { role: roleType })
            .getCount();
    }

    async getRecentRegisteredUsers() {
        const users = await this.userRepo.find({
            order: {
                createdAt: 'DESC',
            },
            take: 5,
        });

        return users
            .filter((user) => user.profile)
            .map((user) => new GetRecentRegisteredUsersResponseDto(user));
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobs } from '@shega/job_portal/entities/jobs.entity';
import { Mentors } from '@shega/job_portal/entities/mentor.entity';
import { Mentorship } from '@shega/job_portal/entities/mentorship.entity';
import { Organization } from '@shega/organization/entities/organization.entity';
import { User } from '@shega/users/entities/user.entity';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
import { CountTotalsResponseDto } from './dtos/response/count-totals.response.dto';

@Injectable()
export class AdminReportService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Jobs) private jobRepo: Repository<Jobs>,
        @InjectRepository(Organization)
        private organizationRepo: Repository<Organization>,
        @InjectRepository(Mentors) private mentorsRepo: Repository<Mentors>,
        @InjectRepository(Mentorship)
        private mentorshipRepo: Repository<Mentorship>,
    ) {}

    async getCountTotals(): Promise<CountTotalsResponseDto> {
        const response = new CountTotalsResponseDto();
        response.totalRegisteredUsers = await this.userRepo.count();
        response.totalRegisteredMentors = await this.mentorsRepo.count();
        response.totalMentorshipProgram = await this.mentorshipRepo.count();
        response.totalPostedJobs = await this.jobRepo.count();
        response.totalRegisteredEmployer = await this.organizationRepo.count();
        response.totalRegisteredJobSeekers = await this.getCountUserByRole(
            UserRoleType.JobSeeker,
        );
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
}

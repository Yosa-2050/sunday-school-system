import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobs } from '@shega/job_portal/entities/jobs.entity';
import { Organization } from '@shega/organization/entities/organization.entity';
import { User } from '@shega/users/entities/user.entity';
import { AdminReportController } from './admin-report.controller';
import { AdminReportService } from './admin-report.service';

@Module({
    controllers: [AdminReportController],
    providers: [AdminReportService],
    imports: [TypeOrmModule.forFeature([User, Jobs, Organization])],
})
export class AdminReportModule {}

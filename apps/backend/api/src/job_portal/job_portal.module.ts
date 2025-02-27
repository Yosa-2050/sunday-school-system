import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationModule } from '@shega/organization/organization.module';
import { Jobs } from './entities/jobs.entity';
import { JobPortalController } from './job_portal.controller';
import { JobPortalService } from './job_portal.service';

@Module({
    controllers: [JobPortalController],
    providers: [JobPortalService],
    imports: [TypeOrmModule.forFeature([Jobs]), OrganizationModule],
})
export class JobPortalModule {}

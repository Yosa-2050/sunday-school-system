import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from '@shega/document/document.module';
import { AddressModule } from '@shega/location/address.module';
import { OrganizationModule } from '@shega/organization/organization.module';
import { Category } from './entities/category.entity';
import { JobCategory } from './entities/job-category.entity';
import { JobSkills } from './entities/job-skills.entity';
import { Jobs } from './entities/jobs.entity';
import { Skills } from './entities/skills.entity';
import { JobDetailController } from './job_detail.controller';
import { JobPortalController } from './job_portal.controller';
import { JobPortalService } from './job_portal.service';
import { JobSeekerController } from './job_seeker.controller';
import { Applicants } from './entities/applicants.entity';
import { JobApplication } from './entities/job-application.entity';
import { UsersModule } from '@shega/users/users.module';
import { JobsService } from './jobs.service';

@Module({
    controllers: [
        JobPortalController,
        JobSeekerController,
        JobDetailController,
    ],
    providers: [JobPortalService, JobsService],
    imports: [
        TypeOrmModule.forFeature([
            Jobs,
            JobSkills,
            JobCategory,
            Category,
            Skills,
            Applicants,
            JobApplication
        ]),
        OrganizationModule,
        DocumentModule,
        AddressModule,
        UsersModule
    ],
    exports : [JobPortalService, JobsService]
})
export class JobPortalModule {}

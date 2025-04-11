import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from '@shega/document/document.module';
import { AddressModule } from '@shega/location/address.module';
import { NotificationModule } from '@shega/notification/notification.module';
import { OrganizationModule } from '@shega/organization/organization.module';
import { UsersModule } from '@shega/users/users.module';
import { ApplicantSkills } from './entities/applicants-skills.entity';
import { Applicants } from './entities/applicants.entity';
import { Category } from './entities/category.entity';
import { EducationHistory } from './entities/educational-history.entity';
import { Experiance } from './entities/experiance.entity';
import { JobApplication } from './entities/job-application.entity';
import { JobCategory } from './entities/job-category.entity';
import { JobSkills } from './entities/job-skills.entity';
import { Jobs } from './entities/jobs.entity';
import { Skills } from './entities/skills.entity';
import { JobDetailController } from './job_detail.controller';
import { JobPortalController } from './job_portal.controller';
import { JobPortalService } from './job_portal.service';
import { JobSeekerController } from './job_seeker.controller';
import { JobsService } from './jobs.service';
import { JobDescription } from './entities/job-description.entity';

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
            JobApplication,
            ApplicantSkills,
            EducationHistory,
            Experiance,
            JobDescription,
        ]),
        OrganizationModule,
        DocumentModule,
        AddressModule,
        UsersModule,
        NotificationModule,
    ],
    exports: [JobPortalService, JobsService],
})
export class JobPortalModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from '@shega/document/document.module';
import { AddressModule } from '@shega/location/address.module';
import { NotificationModule } from '@shega/notification/notification.module';
import { Organization } from '@shega/organization/entities/organization.entity';
import { OrganizationModule } from '@shega/organization/organization.module';
import { UsersModule } from '@shega/users/users.module';
import { ApplicantSkills } from './entities/applicants-skills.entity';
import { Applicants } from './entities/applicants.entity';
import { Category } from './entities/category.entity';
import { EducationHistory } from './entities/educational-history.entity';
import { Experiance } from './entities/experience.entity';
import { Applications } from './entities/job-application.entity';
import { ProgramCategory } from './entities/job-category.entity';
import { ProgramDescription } from './entities/job-description.entity';
import { ProgramSkills } from './entities/job-skills.entity';
import { Jobs } from './entities/jobs.entity';
import { Mentors } from './entities/mentor.entity';
import { Mentorship } from './entities/mentorship.entity';
import { Programs } from './entities/programs.entity';
import { SavedPrograms } from './entities/savedPrograms.entity';
import { Skills } from './entities/skills.entity';
import { JobDetailController } from './job_detail.controller';
import { JobPortalController } from './job_portal.controller';
import { JobPortalService } from './job_portal.service';
import { JobSeekerController } from './job_seeker.controller';
import { JobsService } from './jobs.service';
import { MentorshipController } from './mentorship.controller';
import { MentorshipService } from './mentorship.service';

@Module({
    controllers: [
        JobPortalController,
        JobSeekerController,
        JobDetailController,
        MentorshipController,
    ],
    providers: [JobPortalService, JobsService, MentorshipService],
    imports: [
        TypeOrmModule.forFeature([
            Jobs,
            ProgramSkills,
            ProgramCategory,
            Category,
            Skills,
            Applicants,
            Applications,
            ApplicantSkills,
            EducationHistory,
            Experiance,
            ProgramDescription,
            Programs,
            Mentors,
            Mentorship,
            SavedPrograms,
            Organization,
        ]),
        OrganizationModule,
        DocumentModule,
        AddressModule,
        UsersModule,
        NotificationModule,
    ],
    exports: [JobPortalService, JobsService, MentorshipService],
})
export class JobPortalModule {}

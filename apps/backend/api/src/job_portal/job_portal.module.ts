import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from '@shega/document/document.module';
import { OrganizationModule } from '@shega/organization/organization.module';
import { Jobs } from './entities/jobs.entity';
import { JobPortalController } from './job_portal.controller';
import { JobPortalService } from './job_portal.service';
import { JobSeekerController } from './job_seeker.controller';
import { JobSkills } from './entities/job-skills.entity';
import { JobCategory } from './entities/job-category.entity';
import { Category } from './entities/category.entity';
import { AddressModule } from '@shega/location/address.module';

@Module({
    controllers: [JobPortalController, JobSeekerController],
    providers: [JobPortalService],
    imports: [
        TypeOrmModule.forFeature([Jobs, JobSkills, JobCategory, Category]),
        OrganizationModule,
        DocumentModule,
        AddressModule,
    ],
})
export class JobPortalModule {}

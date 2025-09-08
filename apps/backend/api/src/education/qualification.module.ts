import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from '@shega/document/document.module';
import { AddressModule } from '@shega/location/address.module';
import { NotificationModule } from '@shega/notification/notification.module';
import { Organization } from '@shega/organization/entities/organization.entity';
import { OrganizationModule } from '@shega/organization/organization.module';
import { UsersModule } from '@shega/users/users.module';
import { Category } from './entities/category.entity';
import { EducationHistory } from './entities/educational-history.entity';
import { Experience } from './entities/experience.entity';
import { QualificationSkills } from './entities/qualification-skills.entity';
import { Qualification } from './entities/qualification.entity';
import { Skills } from './entities/skills.entity';
import { QualificationDetailService } from './qualification-detail.service';
import { JobSeekerController } from './qualification.controller';
import { QualificationService } from './qualification.service';
import { QualificationDetailController } from './qualification_detail.controller';

@Module({
    controllers: [JobSeekerController, QualificationDetailController],
    providers: [QualificationService, QualificationDetailService],
    imports: [
        TypeOrmModule.forFeature([
            Category,
            Skills,
            Qualification,
            QualificationSkills,
            EducationHistory,
            Experience,
            Organization,
        ]),
        OrganizationModule,
        DocumentModule,
        AddressModule,
        UsersModule,
        NotificationModule,
    ],
    exports: [QualificationService, QualificationDetailService],
})
export class JobPortalModule {}

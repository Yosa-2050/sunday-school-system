import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from '@shega/document/document.module';
import { Category } from '@shega/education/entities/category.entity';
import { AddressModule } from '@shega/location/address.module';
import { NotificationModule } from '@shega/notification/notification.module';
import { UsersModule } from '@shega/users/users.module';
import { DepartmentMemberController } from './controllers/department-member.controller';
import { DepartmentController } from './controllers/department.controller';
import { OrganizationMemberController } from './controllers/organization-member.controller';
import { OrganizationController } from './controllers/organization.controller';
import { Branch } from './entities/branch.entity';
import { DepartmentMember } from './entities/department-member.entity';
import { Department } from './entities/department.entity';
import { OrganizationMembers } from './entities/organization-member.entity';
import { Organization } from './entities/organization.entity';
import { DepartmentMemberService } from './services/department-member.service';
import { DepartmentService } from './services/department.service';
import { OrganizationMemberService } from './services/organization-member.service';
import { OrganizationService } from './services/organization.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Organization,
            Branch,
            OrganizationMembers,
            Category,
            Department,
            DepartmentMember,
        ]),
        UsersModule,
        AddressModule,
        NotificationModule,
        DocumentModule,
    ],
    controllers: [
        OrganizationController,
        OrganizationMemberController,
        DepartmentController,
        DepartmentMemberController,
    ],
    providers: [
        OrganizationService,
        OrganizationMemberService,
        DepartmentService,
        DepartmentMemberService,
    ],
    exports: [
        OrganizationService,
        OrganizationMemberService,
        DepartmentMemberService,
    ],
})
export class OrganizationModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from '@shega/document/document.module';
import { Category } from '@shega/education/entities/category.entity';
import { AddressModule } from '@shega/location/address.module';
import { NotificationModule } from '@shega/notification/notification.module';
import { UsersModule } from '@shega/users/users.module';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { OrganizationMemberController } from './employees.controller';
import { Branch } from './entities/branch.entity';
import { Department } from './entities/department.entity';
import { EmployeeOrganization } from './entities/employee-organization.entity';
import { OrganizationMembers } from './entities/organization-member.entity';
import { Organization } from './entities/organization.entity';
import { OrganizationMemberService } from './organization-member.service';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Organization,
            Branch,
            OrganizationMembers,
            EmployeeOrganization,
            Category,
            Department,
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
    ],
    providers: [
        OrganizationService,
        OrganizationMemberService,
        DepartmentService,
    ],
    exports: [OrganizationService, OrganizationMemberService],
})
export class OrganizationModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from '@shega/location/address.module';
import { NotificationModule } from '@shega/notification/notification.module';
import { UsersModule } from '@shega/users/users.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Branch } from './entities/branch.entity';
import { EmployeeOrganization } from './entities/employee-organization.entity';
import { Employee } from './entities/employee.entity';
import { Organization } from './entities/organization.entity';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { DocumentModule } from '@shega/document/document.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Organization,
            Branch,
            Employee,
            EmployeeOrganization,
        ]),
        UsersModule,
        AddressModule,
        NotificationModule,
        DocumentModule
    ],
    controllers: [OrganizationController, EmployeesController],
    providers: [OrganizationService, EmployeesService],
    exports: [OrganizationService, EmployeesService],
})
export class OrganizationModule {}

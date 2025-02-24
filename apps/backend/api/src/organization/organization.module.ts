import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Branch } from './entities/branch.entity';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { UsersModule } from 'src/users/users.module';
import { EmployeeOrganization } from './entities/employee-organization.entity';
import { AddressModule } from 'src/location/address.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Organization,
      Branch,
      Employee,
      EmployeeOrganization
    ]),
    UsersModule,
    AddressModule
  ],
  controllers: [OrganizationController, EmployeesController],
  providers: [OrganizationService, EmployeesService],
  exports: [OrganizationService, EmployeesService],
})
export class OrganizationModule {}

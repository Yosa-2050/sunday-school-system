import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { AddressService } from '@shega/location/address.service';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateEmployeeDto } from './dto/request/create-employee.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateEmployeeDto } from './dto/request/update-employee.dto';
import { EmployeeOrganization } from './entities/employee-organization.entity';
import { OrganizationMembers } from './entities/organization-member.entity';

@Injectable()
export class OrganizationMemberService {
    constructor(
        @InjectRepository(OrganizationMembers)
        private employeeRepo: Repository<OrganizationMembers>,
        @InjectRepository(EmployeeOrganization)
        private employeeOrgRepo: Repository<EmployeeOrganization>,
        private profileService: ProfileService,
        private addressService: AddressService,
    ) {}
    async CreateEmployee(dto: CreateEmployeeDto) {
        //if (!validateEmployeeRole(dto.role)) {
        //  throw new BadRequestException('This Role Can Not Be Created');
        // }

        const profile = await this.profileService.createNewUserProfile(
            dto.email,
            dto.password,
            dto.role,
            dto,
            null,
            false,
        );

        const model = this.employeeRepo.create();
        model.profile = profile;
        const employee = await this.employeeRepo.save(model);
        this.addressService.createContactDetails(
            dto.contactDetails,
            employee.profile.id,
            ReferenceType.Profile,
        );
        return profile;
    }

    findAll() {
        return this.employeeRepo.find();
    }

    async findOne(id: string) {
        const employee = await this.employeeRepo.findOneBy({ id });
        if (employee) {
            return employee;
        }
        throw new EntityNotFoundException('Employee');
    }

    update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
        return `This action updates a #${id} employee`;
    }

    remove(id: number) {
        return `This action removes a #${id} employee`;
    }

    getMe() {
        // return this.request.user;
    }

    getEmployeeByProfileId(profileId: string) {
        return this.employeeRepo.findOneBy({
            profile: { id: profileId },
            isActive: true,
        });
    }
}

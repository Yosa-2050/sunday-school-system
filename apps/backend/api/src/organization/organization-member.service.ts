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
import { OrganizationMembers } from './entities/organization-member.entity';

@Injectable()
export class OrganizationMemberService {
    constructor(
        @InjectRepository(OrganizationMembers)
        private organizationMemberRepo: Repository<OrganizationMembers>,
        private profileService: ProfileService,
        private addressService: AddressService,
    ) {}
    async CreateEmployee(dto: CreateEmployeeDto) {
        const profile = await this.profileService.createNewUserProfile(
            dto.email,
            dto.password,
            dto.role,
            dto,
            null,
            false,
        );

        const model = this.organizationMemberRepo.create();
        model.profile = profile;
        const member = await this.organizationMemberRepo.save(model);
        this.addressService.createContactDetails(
            dto.contactDetails,
            member.profile.id,
            ReferenceType.Profile,
        );
        return member;
    }

    findAll() {
        return this.organizationMemberRepo.find();
    }

    async findByIdOrThrow(id: string) {
        const employee = await this.organizationMemberRepo.findOneBy({ id });
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
        return this.organizationMemberRepo.findOneBy({
            profile: { id: profileId },
            isActive: true,
        });
    }
}

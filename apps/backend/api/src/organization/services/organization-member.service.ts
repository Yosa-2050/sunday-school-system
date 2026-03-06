import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import type { PaginationDto } from '@shega/Utilities/models/paginated.request';
// biome-ignore lint/style/useImportType: <explanation>
import { AddressService } from '@shega/location/address.service';
import { LoginBy } from '@shega/users/enums/login-by.enum';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import {
    CreateEmployeeDto,
    CreateOrganizationUserDto,
} from '../dto/request/create-organization-member.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateEmployeeDto } from '../dto/request/update-employee.dto';
import {
    OrganizationMemberResponseDto,
    PaginatedOrganizationMemberResponseDto,
} from '../dto/response/organization-member.response.dto';
import { OrganizationMembers } from '../entities/organization-member.entity';
import { Organization } from '../entities/organization.entity';
import { OrganizationMemberType } from '../enums/employee-type.enum';

@Injectable()
export class OrganizationMemberService {
    constructor(
        @InjectRepository(OrganizationMembers)
        private organizationMemberRepo: Repository<OrganizationMembers>,
        private profileService: ProfileService,
        private addressService: AddressService,
        @InjectRepository(Organization)
        private organizationRepo: Repository<Organization>,
        //private organizationService: OrganizationService
    ) {}
    async CreateEmployee(dto: CreateEmployeeDto, organizationId: string) {
        //const organization = await this.organizationService.findOneOrThrow(organizationId);
        const organization = await this.organizationRepo.findOneBy({
            id: organizationId,
        });
        if (!organization) {
            throw new EntityNotFoundException('Organization');
        }
        const profile = await this.profileService.createNewUserProfile(
            dto.email,
            dto.password,
            UserRoleType.Member,
            dto,
            null,
            false,
        );
        const model = this.organizationMemberRepo.create();
        model.profile = profile;
        model.organization = organization;
        model.type = OrganizationMemberType.Member;
        const member = await this.organizationMemberRepo.save(model);
        // this.addressService.createContactDetails(
        //     dto.contactDetails,
        //     member.profile.id,
        //     ReferenceType.Profile,
        // );
        return member;
    }

    async findAll(organizationId: string) {
        const members = await this.organizationMemberRepo.find({
            where: { organization: { id: organizationId } },
        });
        if (!members.length) {
            throw new EntityNotFoundException('No Member Found');
        }
        return members;
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

    async CreateSQDEMember(
        dto: CreateOrganizationUserDto,
        pwdGenerated: string,
        role: UserRoleType,
        type: OrganizationMemberType,
        organizationId: string,
    ) {
        const profile = await this.profileService.createNewUserProfileQDE(
            dto.email,
            LoginBy.EMAIL,
            role,
            dto.firstName,
            dto.middleName,
            dto.lastName,
            '',
            null,
            '',
            '',
            false,
            pwdGenerated,
            true,
        );
        const organization = await this.organizationRepo.findOneBy({
            id: organizationId,
        });
        if (!organization) {
            throw new EntityNotFoundException('Organization');
        }
        const model = this.organizationMemberRepo.create();
        model.profile = profile;
        model.type = type;
        model.organization = organization;
        const member = await this.organizationMemberRepo.save(model);
        return member;
    }

    async findAllPaginated(
        organizationId: string,
        pagination: PaginationDto,
    ): Promise<PaginatedOrganizationMemberResponseDto> {
        const queryBuilder = this.organizationMemberRepo
            .createQueryBuilder('member')
            .leftJoinAndSelect('member.profile', 'profile')
            .leftJoinAndSelect('profile.user', 'user')
            .where('member.organization.id = :organizationId', {
                organizationId,
            });

        if (pagination.search) {
            const search = `%${pagination.search}%`;
            queryBuilder.andWhere(
                '(profile.firstName ILIKE :search OR profile.middleName ILIKE :search OR profile.lastName ILIKE :search OR user.email ILIKE :search)',
                { search },
            );
        }

        queryBuilder
            .skip((pagination.page - 1) * pagination.limit)
            .take(pagination.limit)
            .orderBy('member.createdAt', 'DESC');

        const [items, total] = await queryBuilder.getManyAndCount();

        const data: OrganizationMemberResponseDto[] = items.map((item) =>
            OrganizationMemberResponseDto.fromEntity(item),
        );

        return new PaginatedOrganizationMemberResponseDto(
            data,
            total,
            pagination.page,
            pagination.limit,
        );
    }

    search(query: string, organizationId: string) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        return this.organizationMemberRepo
            .createQueryBuilder('member')
            .leftJoinAndSelect('member.profile', 'profile')
            .leftJoinAndSelect('profile.user', 'user')
            .where('member.organizationId = :organizationId', {
                organizationId,
            })
            .andWhere(
                `(profile.firstName ILIKE :query
                OR profile.middleName ILIKE :query
                OR profile.lastName ILIKE :query
                OR user.email ILIKE :query)`,
            )
            .setParameter('query', `%${query}%`)
            .orderBy('profile.firstName', 'ASC')
            .limit(10)
            .getMany();
    }
}

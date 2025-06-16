import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';
import { PasswordService } from '@shega/Utilities/password.service';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { UserDetails } from '@shega/auth/dtos/response/user-response-payload.reponse.dto';
import { Category } from '@shega/job_portal/entities/category.entity';
import { AddressService } from '@shega/location/address.service';
// biome-ignore lint/style/useImportType: <explanation>
import { LocationModel } from '@shega/location/dto/model/location.model';
// biome-ignore lint/style/useImportType: <explanation>
import { ContactDetailsRequest } from '@shega/location/dto/request/contact-detail.request.dto';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
import { NotificationService } from '@shega/notification/notification.service';
import { UserRoleType, UserRoleValue } from '@shega/users/enums/user-role.enum';
import { ProfileService } from '@shega/users/profile.service';
// biome-ignore lint/style/useImportType: <explanation>
import { UsersService } from '@shega/users/users.service';
// biome-ignore lint/style/useImportType: <explanation>
import { QueryBuilderService } from 'shared/query-builder.service';
import {
    type EntityParam,
    entityParamDeserializer,
    entityParamSerializer,
} from 'shared/schema';
// biome-ignore lint/style/useImportType: <explanation>
import { In, Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { AddOrganizationBranchDto } from './dto/request/add-branch.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { AssignEmployeeRequestDto } from './dto/request/assign-security-person.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateOrganizationEmployeeDto } from './dto/request/create-employee.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateOrganizationDto } from './dto/request/create-organization.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateOrganizationInfoDto } from './dto/request/update-organization.dto';
import { GetOrganizationListResponseDto } from './dto/response/get-organization.response.dto';
import { EmployeesService } from './employees.service';
import { Branch } from './entities/branch.entity';
import { EmployeeOrganization } from './entities/employee-organization.entity';
import { Employee } from './entities/employee.entity';
import { Organization } from './entities/organization.entity';
import { EmployeeType } from './enums/employee-type.enum';

@Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(Organization)
        private organizationRepo: Repository<Organization>,
        @InjectRepository(EmployeeOrganization)
        private employeeOrgRepo: Repository<EmployeeOrganization>,
        @InjectRepository(Employee)
        private employeeRepo: Repository<Employee>,
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
        @InjectRepository(Branch) private branchRepo: Repository<Branch>,
        @Inject(EmployeesService) private employeeService: EmployeesService,
        @Inject(AddressService) private addressService: AddressService,
        @Inject(ProfileService) private profileService: ProfileService,
        @Inject(NotificationService)
        private notificationService: NotificationService,
        @Inject(PasswordService)
        private readonly passwordService: PasswordService,
        private queryBuilderService: QueryBuilderService,
        private readonly usersService: UsersService,
    ) {}

    async organizationApproval(
        id: string,
        status: ApprovalType,
        note?: string,
    ) {
        const org = await this.organizationRepo.findOneBy({ id });
        if (!org) {
            throw new EntityNotFoundException('Organization');
        }

        const updatedOrg = await this.organizationRepo.update(
            { id },
            { status, note },
        );

        const result = UtilityServices.EnsureUpdated(updatedOrg, id);
        if (result.sucess) {
            let emailTemplate = null;
            const employeeList = await this.findEmployee(id);
            const profile = employeeList[0].employee.profile;

            if (status === ApprovalType.Approved) {
                emailTemplate = await this.notificationService.getTemplate(
                    'orgRegistrationApprovedEmailTemplate',
                    {
                        contactPerson: profile.firstName,
                        organizationName: org.name,
                    },
                    {
                        organizationName: org.name,
                    },
                );
            }

            if (status === ApprovalType.Declined) {
                emailTemplate = await this.notificationService.getTemplate(
                    'orgRegistrationDeclinedEmailTemplate',
                    {
                        contactPerson: profile.firstName,
                        organizationName: org.name,
                        reasonForDecline: note,
                    },
                    {
                        organizationName: org.name,
                    },
                );
            }

            const user = await this.profileService.findUserByProfileId(
                profile.id,
            );

            //send email notification
            this.notificationService.send({
                channel: NotificationChannel.Email,
                content: emailTemplate.content,
                to: user.email,
                subject: emailTemplate.subject,
                reference: user.id,
            });

            //For testing
            //send real time in-app nofitcation
            if (status === ApprovalType.Approved) {
                this.notificationService.send({
                    channel: NotificationChannel.InApp,
                    subject: 'Organization Approved',
                    content:
                        'Your Organization has been approved and is now live on the shega platform.',
                    to: user.id,
                    reference: user.id,
                    isRealTimeNofitication: true,
                    isNotifyToAllUser: false,
                });
            }
        }
        return result;
    }

    async create(request: CreateOrganizationDto) {
        const organization = this.organizationRepo.create(request);
        organization.status = ApprovalType.New;
        organization.branches = [];
        const branches = await organization.branches;

        const branch = this.branchRepo.create();
        branch.name = request.mainBranchName ?? 'Main Branch';
        branch.isMainBranch = true;
        branches.push(branch);

        const org = await this.organizationRepo.save(organization);
        this.addressService.createContactDetails(
            request.contactDetails,
            org.id,
            ReferenceType.Organization,
        );
        return org;
    }

    async addBranch(request: AddOrganizationBranchDto, orgId: string) {
        const org = await this.organizationRepo.findOneBy({ id: orgId });
        if (!org) {
            throw new EntityNotFoundException('Organization');
        }
        const branch = this.branchRepo.create();
        branch.name = request.branchName;
        branch.isMainBranch = false;
        branch.organization = org;

        const saved = await this.branchRepo.save(branch);
        this.addressService.createContactDetails(
            request.contactDetails,
            saved.id,
            ReferenceType.Branch,
        );
        return saved;
    }

    findAll() {
        return this.organizationRepo.findBy({
            isActive: true,
            deletedAt: null,
        });
    }

    async getList(list: string[]) {
        const organizations = await this.organizationRepo.find({
            where: { id: In(list) },
        });

        return organizations.map(
            (org) => new GetOrganizationListResponseDto(org),
        );
    }

    async findAllPaginated(dto: string, exportList = false) {
        // Convert PaginationDto to the format expected by QueryBuilderService
        const { p, pp, s, f, o } = entityParamDeserializer(dto);

        const queryParams: EntityParam = {
            p,
            pp,
            s,
            f,
            o: o || [{ f: 'createdAt', d: 'desc' }],
        };
        // Define searchable columns (if applicable)
        const searchableColumns = ['name']; // Add other searchable columns if needed
        if (exportList) {
            queryParams.p = 0;
            queryParams.pp = 0;
        }
        const queryString = entityParamSerializer(queryParams);

        // Use the QueryBuilderService to build and execute the query
        const { data: organizations, total } =
            await this.queryBuilderService.buildQuery(
                this.organizationRepo,
                queryString,
                [], // No joins needed for this query
                searchableColumns,
            );

        // Map the results to the response DTO
        return new PaginatedResponseDto<GetOrganizationListResponseDto[]>(
            organizations.map((org) => new GetOrganizationListResponseDto(org)),
            total,
            p,
            pp,
        );
    }

    async getOrganizationById(organizationId: string) {
        const organization = await this.organizationRepo.findOneBy({
            id: organizationId,
        });
        if (!organization) {
            throw new EntityNotFoundException('Organization');
        }
        return organization;
    }

    async findOne(id: string) {
        const organization = await this.organizationRepo.findOneBy({ id: id });
        if (!organization) {
            throw new EntityNotFoundException('Organization');
        }
        const contactDetails = await this.addressService.getContactByRefernce(
            organization.id,
            ReferenceType.Organization,
        );
        const location = await this.addressService.getLocationByRefernce(
            organization.id,
            ReferenceType.Organization,
        );
        organization.contacts = contactDetails;
        organization.locations = location;
        return organization;
    }

    async updateOrganization(
        id: string,
        dto: Partial<UpdateOrganizationInfoDto>,
    ) {
        const organization = await this.findOne(id);
        if (dto.sectorId) {
            const sector = await this.categoryRepo.findOneBy({
                id: dto.sectorId,
            });
            if (!sector) {
                throw new EntityNotFoundException('Category', dto.sectorId);
            }
            organization.sector = sector;
        }
        Object.assign(organization, dto);
        return this.organizationRepo.save(organization);
    }

    remove(id: number) {
        return `This action removes a #${id} organization`;
    }

    async assignEmployee(request: AssignEmployeeRequestDto) {
        const org = await this.findOne(request.organizationId);
        const employee = await this.employeeService.findOne(request.employeeId);
        const assignEmployee = await this.employeeOrgRepo.findOneBy({
            employee: { id: request.employeeId },
            isActive: true,
        });
        if (assignEmployee) {
            throw new BadRequestException(
                'Employee already assigned to an organization',
            );
        }
        let branch = null;
        if (request.branchId) {
            const branches = await org?.branches;
            branch = branches?.find((x) => x.id === request.branchId);
            if (!branch) {
                throw new EntityNotFoundException('Branch');
            }
        }
        const person = this.employeeOrgRepo.create();
        person.organization = org;
        person.employee = employee;
        person.branch = branch;
        person.type = request.type;

        return this.employeeOrgRepo.save(person);
    }

    async findEmployee(id: string) {
        return await this.employeeOrgRepo.findBy({
            organization: { id },
            isActive: true,
        });
    }

    findAssignedEmployeeByEmployeeId(id: string) {
        return this.employeeOrgRepo.findOneBy({
            employee: { id },
            isActive: true,
        });
    }

    findAssignedEmployeeById(id: string) {
        return this.employeeOrgRepo.findOneBy({ id });
    }

    findBranches(orgId: string) {
        return this.branchRepo.findBy({
            organization: { id: orgId },
            isActive: true,
        });
    }

    async getOrganizationDetail(profileId: string) {
        const employee =
            await this.employeeService.getEmployeeByProfileId(profileId);
        //assumpiton Employee only have one active org assignment
        const assignEmployee = await this.findAssignedEmployeeByEmployeeId(
            employee.id,
        );
        const organization = await assignEmployee?.organization;
        const branch = await assignEmployee?.branch;
        const userDetails = new UserDetails();
        userDetails.organizationId = organization?.id;
        userDetails.employeeId = employee?.id;
        userDetails.employeeOrgId = assignEmployee.id;
        userDetails.profileId = employee?.profile?.id;
        return userDetails;
        // return {
        //     employeeId: employee?.id,
        //     assignedEmployeeId: assignEmployee?.id,
        //     organizationId: organization?.id,
        //     branchId: branch?.id,
        // };
    }

    async CreateEmployeeQDE(dto: CreateOrganizationEmployeeDto) {
        const organization = await this.organizationRepo.findOneBy({
            name: dto.organizationName,
        });
        if (organization) {
            throw new BadRequestException(
                `Organization with name '${dto.organizationName}' exists`,
            );
        }
        const pwdGenerated = this.passwordService.generatePassword();
        //const pwdGenerated = "12345678";
        const profile = await this.profileService.createNewUserProfileQDE(
            dto.email,
            UserRoleType.WorkProvider,
            dto.firstName,
            dto.middleName,
            dto.lastName,
            false,
            pwdGenerated,
            true,
        );

        const model = this.employeeRepo.create();
        model.profile = profile;
        const employee = model;
        const empOrg = await this.employeeOrgRepo.create();
        empOrg.employee = employee;
        empOrg.type = EmployeeType.Administrator;
        empOrg.organization = await this.organizationRepo.create({
            name: dto.organizationName,
            status: ApprovalType.New,
        });

        const saved = await this.employeeOrgRepo.save(empOrg);
        const signupEmailTemplate = await this.notificationService.getTemplate(
            'signupEmailTemplate',
            {
                userName: dto.firstName,
                role: UserRoleValue(UserRoleType.WorkProvider).value,
                email: dto.email,
                tempPassword: pwdGenerated,
                loginUrl: UserRoleValue(UserRoleType.WorkProvider).url,
            },
            null,
        );
        if (saved?.id) {
            this.notificationService.send({
                channel: NotificationChannel.Email,
                content: signupEmailTemplate.content,
                to: dto.email,
                subject: signupEmailTemplate.subject,
                reference: saved.id,
            });
            return saved;
        }
        return saved;
    }

    async setOrgActivationStatus(
        orgId: string,
        isOrgActive: boolean,
        isActivateProcess: boolean,
        isIncludeEmployees: string,
        note: string,
    ) {
        const isIncludeEmployeesBoolean = isIncludeEmployees === 'true';
        const org = await this.organizationRepo.findOneBy({ id: orgId });
        //activate/deactivate users if included employees in the request
        if (isIncludeEmployeesBoolean) {
            const isUserActive = isActivateProcess;
            const employeeList = await this.findEmployee(orgId);
            const profileIds = [];
            const users = [];

            for (const employee of employeeList) {
                profileIds.push(employee.employee.profile.id);
            }

            for (const profileId of profileIds) {
                const user =
                    await this.profileService.findUserByProfileId(profileId);
                users.push(user);
            }

            for (const user of users) {
                this.usersService.setUserActivationStatusFromOrg(
                    user.id,
                    isUserActive,
                    org.name,
                    note,
                );
            }
        }

        //activate/deactivate org
        const update = await this.organizationRepo.preload({
            id: orgId,
            isActive: isOrgActive,
            note: note,
        });
        if (!update) {
            throw new EntityNotFoundException('Organization');
        }
        return this.organizationRepo.save(update);
    }

    updateOrganizationContactDetails(
        orgId: string,
        contactDetails: ContactDetailsRequest,
    ) {
        return this.addressService.createContactDetails(
            contactDetails,
            orgId,
            ReferenceType.Organization,
        );
    }

    updateOrganizationLocation(orgId: string, location: LocationModel[]) {
        return this.addressService.createLocation(
            location,
            orgId,
            ReferenceType.Organization,
        );
    }
}

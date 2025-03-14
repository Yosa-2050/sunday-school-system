import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { PaginationDto } from '@shega/Utilities/models/paginated.request';
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';
import { PasswordService } from '@shega/Utilities/password.service';
import { UserDetails } from '@shega/auth/dtos/response/user-response-payload.reponse.dto';
import { AddressService } from '@shega/location/address.service';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
import { NotificationService } from '@shega/notification/notification.service';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
import { ProfileService } from '@shega/users/profile.service';
// biome-ignore lint/style/useImportType: <explanation>
import { ILike, Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { AddOrganizationBranchDto } from './dto/request/add-branch.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { AssignEmployeeRequestDto } from './dto/request/assign-security-person.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateOrganizationEmployeeDto } from './dto/request/create-employee.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateOrganizationDto } from './dto/request/create-organization.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateOrganizationDto } from './dto/request/update-organization.dto';
import { GetOrganizationListResponseDto } from './dto/response/get-organization.response.dto';
import { EmployeesService } from './employees.service';
import { Branch } from './entities/branch.entity';
import { EmployeeOrganization } from './entities/employee-organization.entity';
import { Employee } from './entities/employee.entity';
import { Organization } from './entities/organization.entity';
import { EmployeeType } from './enums/employee-type.enum';
import { StatusType } from '@shega/Utilities/enums/status-type.enum';

@Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(Organization)
        private organizationRepo: Repository<Organization>,
        @InjectRepository(EmployeeOrganization)
        private employeeOrgRepo: Repository<EmployeeOrganization>,
        @InjectRepository(Employee)
        private employeeRepo: Repository<Employee>,
        @InjectRepository(Branch) private branchRepo: Repository<Branch>,
        @Inject(EmployeesService) private employeeService: EmployeesService,
        @Inject(AddressService) private addressService: AddressService,
        @Inject(ProfileService) private profileService: ProfileService,
        @Inject(NotificationService)
        private notificationService: NotificationService,
        @Inject(PasswordService)
        private readonly passwordService: PasswordService,
    ) {}

    async create(request: CreateOrganizationDto) {
        const organization = this.organizationRepo.create(request);
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
            throw new NotFoundException('Organization not found');
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

    async findAllPaginated(dto: PaginationDto) {
        const search = dto.search;
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const filters: any = {};

        const skip = (dto.page - 1) * dto.limit;

        if (dto.status === StatusType.Active) {
            filters.isActive = true;
        }
        if (dto.status === StatusType.InActive) {
            filters.isActive = false;
        }
        // If search is provided, add OR conditions
        if (search) {
            filters.name = ILike(`%${search}%`);
        }

        const [organizations, count] = await this.organizationRepo.findAndCount(
            {
                //where: search ? [{ name: ILike(`%${search}`) }] : {},
                where: filters,
                order: { createdAt: 'DESC' },
                take: dto.limit,
                skip: skip,
            },
        );

        return new PaginatedResponseDto<GetOrganizationListResponseDto[]>(
            organizations.map((org) => {
                return new GetOrganizationListResponseDto(org);
            }),
            count,
            dto.page,
            dto.limit,
        );
    }

    async getOrganizationById(organizationId: string) {
        const organization = await this.organizationRepo.findOneBy({
            id: organizationId,
        });
        if (!organization) {
            throw new NotFoundException('Organization not found');
        }
        return organization;
    }

    async findOne(id: string) {
        const organization = await this.organizationRepo.findOneBy({ id: id });
        if (!organization) {
            throw new NotFoundException('Organization not found');
        }
        const contactDetails = await this.addressService.getContanctByRefernce(
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

    update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
        return `This action updates a #${id} organization`;
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
                throw new BadRequestException('Branch not found');
            }
        }
        const person = this.employeeOrgRepo.create();
        person.organization = org;
        person.employee = employee;
        person.branch = branch;
        person.type = request.type;

        return this.employeeOrgRepo.save(person);
    }

    findEmployee(id: string) {
        return this.employeeOrgRepo.findBy({
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
            throw new NotFoundException(
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
        });

        const saved = await this.employeeOrgRepo.save(empOrg);
        if (saved?.id) {
            await this.notificationService.send({
                channel: NotificationChannel.Email,
                content: `please login to your account using your email ${dto.email} and password ${pwdGenerated}. Then reset your password.`,
                to: dto.email,
                subject: 'Shega jobs',
                reference: saved.id,
            });
            return saved;
        }
        return saved;
    }
}

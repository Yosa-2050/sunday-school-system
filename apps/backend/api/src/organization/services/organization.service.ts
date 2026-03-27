import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';
import { PasswordService } from '@shega/Utilities/password.service';
import { LookupService } from '@shega/Utilities/service/lookup-seeder.service';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { UserDetails } from '@shega/auth/dtos/response/user-response-payload.response.dto';
import { DocumentService } from '@shega/document/document.service';
import { Category } from '@shega/education/entities/category.entity';
import { AddressService } from '@shega/location/address.service';
import { LocationModel } from '@shega/location/dto/model/location.model';
import { ContactDetailsRequest } from '@shega/location/dto/request/contact-detail.request.dto';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
import { NotificationType } from '@shega/notification/enums/notification-type.enum';
import { NotesService } from '@shega/notification/notes.service';
import { NotificationService } from '@shega/notification/notification.service';
import { User } from '@shega/users/entities/user.entity';
import { LoginBy } from '@shega/users/enums/login-by.enum';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
import { ProfileService } from '@shega/users/profile.service';
import { UsersService } from '@shega/users/users.service';
import { Express } from 'express';
import { QueryBuilderService } from 'shared/query-builder.service';
import {
    type EntityParam,
    entityParamDeserializer,
    entityParamSerializer,
} from 'shared/schema';
import { In, Repository } from 'typeorm';

import { AddOrganizationBranchDto } from '../dto/request/add-branch.dto';
import { AssignMembersToOrganizationRequestDto } from '../dto/request/assign-person-to-org.request.dto';
import {
    CreateOrgEmployeeWithContactDto,
    CreateOrganizationMemberWithOrgDto,
    CreateOrganizationUserDto,
} from '../dto/request/create-organization-member.dto';
import { CreateOrganizationDto } from '../dto/request/create-organization.dto';
import { UpdateOrganizationInfoDto } from '../dto/request/update-organization.dto';
import { GetOrganizationListResponseDto } from '../dto/response/get-organization.response.dto';
import { Branch } from '../entities/branch.entity';
import { OrganizationMembers } from '../entities/organization-member.entity';
import { Organization } from '../entities/organization.entity';
import { OrganizationMemberType } from '../enums/employee-type.enum';
import { OrganizationMemberService } from './organization-member.service';

@Injectable()
export class OrganizationService {
    async addContactPerson(
        organizationId: string,
        dto: CreateOrgEmployeeWithContactDto,
    ) {
        const organization = await this.organizationRepo.findOneBy({
            id: organizationId,
        });
        if (!organization) {
            throw new EntityNotFoundException(
                typeof Organization,
                organizationId,
            );
        }

        if (dto.employeeOrgId) {
            return this.UpdateContactPerson(dto);
        }

        const profile = this.profileService.createProfileQDE(
            dto.firstName,
            dto.middleName,
            dto.lastName,
            dto.phoneNumber,
        );

        const model = this.organizationMemberRepo.create();
        model.profile = profile;
        model.type = dto.position;
        model.organization = organization;

        return await this.organizationMemberRepo.save(model);
    }

    async UpdateContactPerson(dto: CreateOrgEmployeeWithContactDto) {
        const member = await this.organizationMemberRepo.findOneBy({
            id: dto.employeeOrgId,
        });

        const profile = member.profile;

        const updatedProfile = this.profileService.updateProfileQDE(
            profile.id,
            dto.firstName,
            dto.middleName,
            dto.lastName,
            dto.phoneNumber,
        );
        const updatedResult = await this.organizationMemberRepo.update(
            { id: dto.employeeOrgId },
            { type: dto.position },
        );
        return UtilityServices.EnsureUpdated(updatedResult, dto.employeeOrgId);
    }
    constructor(
        @InjectRepository(Organization)
        private organizationRepo: Repository<Organization>,

        @InjectRepository(OrganizationMembers)
        private organizationMemberRepo: Repository<OrganizationMembers>,
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
        @InjectRepository(Branch) private branchRepo: Repository<Branch>,
        @Inject(OrganizationMemberService)
        private employeeService: OrganizationMemberService,
        @Inject(AddressService) private addressService: AddressService,
        @Inject(ProfileService) private profileService: ProfileService,
        @Inject(NotificationService)
        private notificationService: NotificationService,
        @Inject(NotesService)
        private notesService: NotesService,
        @Inject(PasswordService)
        private readonly passwordService: PasswordService,
        private queryBuilderService: QueryBuilderService,
        private readonly usersService: UsersService,
        private readonly lookupService: LookupService,
        private documentService: DocumentService,
    ) {}

    async organizationApproval(
        id: string,
        status: ApprovalType,
        note?: string,
    ) {
        const org = await this.organizationRepo.findOneBy({ id });
        if (!org) {
            throw new EntityNotFoundException(typeof Organization);
        }

        if (org.status === ApprovalType.Declined) {
            throw new ForbiddenException('Organization is declined');
        }

        if (
            status === ApprovalType.Waiting_Approval &&
            !(await this.CheckOrgCanBeSubmitted(id)).canSubmit
        ) {
            throw new BadRequestException(
                'Organization can not be submitted please provide all information',
            );
        }

        const updatedOrg = await this.organizationRepo.update(
            { id },
            { status },
        );

        const result = UtilityServices.EnsureUpdated(updatedOrg, id);
        if (result.success) {
            if (note) {
                await this.notesService.create(
                    id,
                    note,
                    'Organization approval',
                );
            }

            let emailTemplate = null;
            const employeeList = await this.findMembers(id);
            const profile = employeeList[0].profile;

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

            if (status === ApprovalType.Returned) {
                emailTemplate = await this.notificationService.getTemplate(
                    'orgReturnForAdjustmentEmailTemplate',
                    {
                        contactPerson: profile.firstName,
                        reasonForAdjustment: note,
                    },
                    {},
                );
            }

            const userProfile = await this.profileService.findById(profile.id);
            const userName = `${userProfile.firstName} ${userProfile.middleName} ${userProfile.lastName}`;

            this.SendNotificationForApprovals(
                emailTemplate,
                userProfile.user,
                status,
                note,
                org.name,
                org.id,
                userName,
            );
        }
        return result;
    }

    async CheckOrgCanBeSubmitted(id: string) {
        const applyObject = {
            organizationDetail: true,
            documents: true,
            contactPerson: true,
            location: true,
            canSubmit: true,
        };
        const org = await this.findOne(id);
        if (
            !(
                org.name &&
                org.registrationNumber &&
                org.type &&
                org.industry &&
                org.yearFounded &&
                org.companySize
            )
        ) {
            applyObject.canSubmit = false;
            applyObject.organizationDetail = false;
        }
        //primary contact person
        const employee = await org.members;
        if (
            !employee?.find(
                (x) => x.type === OrganizationMemberType.ContactPerson,
            )
        ) {
            applyObject.canSubmit = false;
            applyObject.contactPerson = false;
        }
        //location
        if (!org.locations) {
            applyObject.canSubmit = false;
            applyObject.location = false;
        }

        //document
        const documents =
            await this.documentService.findDocumentsByReferenceId(id);
        const lookups = await this.lookupService.findByGroup(
            'DocumentType',
            'OrganizationDocuments',
        );
        const documentTypes = documents.map((doc) => doc.docType);

        const allTypesPresent = lookups.every((lookup) =>
            documentTypes.includes(lookup.code),
        );

        if (!allTypesPresent) {
            applyObject.canSubmit = false;
            applyObject.documents = false;
        }

        return applyObject;
    }

    private async SendNotificationForApprovals(
        emailTemplate: any,
        user: User,
        status: ApprovalType,
        reasonForDecline: string,
        orgName: string,
        orgId: string,
        userName: string,
    ) {
        if (emailTemplate) {
            this.notificationService.send({
                channel: NotificationChannel.Email,
                content: emailTemplate.content,
                to: user.email,
                subject: emailTemplate.subject,
                reference: user.id,
                type: NotificationType.Organization,
                metaData: null,
            });
        }

        const metaData = {
            organizationId: orgId,
        };

        if (status === ApprovalType.Approved) {
            this.notificationService.send({
                channel: NotificationChannel.InApp,
                subject: 'Organization Status: Approved!',
                content: `Congratulations! Your organization, <b>${orgName}</b>, has been approved and is now ready to post jobs on Herani Sunday School Management System.`,
                to: user.id,
                reference: user.id,
                isRealTimeNotification: true,
                isNotifyToAllUser: false,
                type: NotificationType.Organization,
                metaData,
            });
        } else if (status === ApprovalType.Declined) {
            this.notificationService.send({
                channel: NotificationChannel.InApp,
                subject: 'Organization Status: Declined!',
                content: `Unfortunately, your organization, <b>${orgName}</b>, could not be approved at this time. The reason for declined is ${reasonForDecline}.`,
                to: user.id,
                reference: user.id,
                isRealTimeNotification: true,
                isNotifyToAllUser: false,
                type: NotificationType.Organization,
                metaData,
            });
        } else if (status === ApprovalType.Returned) {
            this.notificationService.send({
                channel: NotificationChannel.InApp,
                subject:
                    'Action Required: Organization Details Need Adjustments',
                content:
                    "Your organization's details require some adjustments before we can approve your profile. Tap to see what needs to be updated and resubmit for review.",
                to: user.id,
                reference: user.id,
                isRealTimeNotification: true,
                isNotifyToAllUser: false,
                type: NotificationType.Organization,
                metaData: null,
            });
        } else if (status === ApprovalType.Waiting_Approval) {
            const superAdmin = await this.usersService.GetSuperAdmin();
            this.notificationService.send({
                channel: NotificationChannel.InApp,
                subject: 'Action Required: New Organization Approval Request',
                content: `<b>${userName}</b> has requested approval for their organization, <b>${orgName}</b>. Please review and approve or deny this request to grant them full access.`,
                to: superAdmin.id,
                reference: superAdmin.id,
                isRealTimeNotification: true,
                isNotifyToAllUser: false,
                type: NotificationType.Organization,
                metaData,
            });
        }
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
            throw new EntityNotFoundException(typeof Organization);
        }
        const contactDetails = await this.addressService.getContactByReference(
            organization.id,
            ReferenceType.Organization,
        );
        const location = await this.addressService.getLocationByReference(
            organization.id,
            ReferenceType.Organization,
        );

        const notes = await this.notesService.getNotesByReference(id);
        organization.contacts = contactDetails;
        organization.locations = location;
        organization.notes = notes;
        organization.members = await organization.members;
        return organization;
    }

    async findOneOrThrow(id: string) {
        const organization = await this.organizationRepo.findOneBy({ id: id });
        if (!organization) {
            throw new EntityNotFoundException(typeof Organization);
        }
        return organization;
    }

    async updateOrganization(
        id: string,
        dto: Partial<UpdateOrganizationInfoDto>,
    ) {
        const organization = await this.findOne(id);
        if (dto.industryId) {
            const industry = await this.lookupService.findById(dto.industryId);
            if (!industry) {
                throw new EntityNotFoundException('Lookup', dto.industryId);
            }
            organization.industry = industry;
        }
        Object.assign(organization, dto);
        return this.organizationRepo.save(organization);
    }

    remove(id: number) {
        return `This action removes a #${id} organization`;
    }

    async assignEmployee(request: AssignMembersToOrganizationRequestDto) {
        const org = await this.findOne(request.organizationId);
        const employee = await this.employeeService.findByIdOrThrow(
            request.profileId,
        );
        const assignEmployee = await this.organizationMemberRepo.findOneBy({
            profile: { id: request.profileId },
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
        const person = this.organizationMemberRepo.create();
        person.organization = org;
        person.branch = branch;
        person.type = request.type;

        return this.organizationMemberRepo.save(person);
    }

    async findMembers(id: string) {
        return await this.organizationMemberRepo.findBy({
            organization: { id },
            isActive: true,
        });
    }

    findMemberById(id: string) {
        return this.organizationMemberRepo.findOneBy({
            id,
            isActive: true,
        });
    }

    findAssignedEmployeeById(id: string) {
        return this.organizationMemberRepo.findOneBy({ id });
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
        //assumption Employee only have one active org assignment
        const assignEmployee = await this.findMemberById(employee.id);
        const organization = await assignEmployee?.organization;
        const branch = await assignEmployee?.branch;
        const userDetails = new UserDetails();
        userDetails.organizationId = organization?.id;
        userDetails.employeeId = employee?.id;
        userDetails.employeeOrgId = assignEmployee.id;
        userDetails.profileId = employee?.profile?.id;
        userDetails.organizationName = organization?.name;
        userDetails.organizationStatus = organization?.status;
        return userDetails;
    }

    async CreateOrganizationMemberQDE(dto: CreateOrganizationMemberWithOrgDto) {
        const organization = await this.organizationRepo.findOneBy({
            name: dto.organizationName,
        });
        if (organization) {
            throw new BadRequestException(
                `Organization with name '${dto.organizationName}' exists`,
            );
        }
        const pwdGenerated = this.passwordService.generatePassword();
        const profile = await this.profileService.createNewUserProfileQDE(
            dto.email,
            LoginBy.EMAIL,
            UserRoleType.SchoolAdmin,
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

        const model = this.organizationMemberRepo.create();
        model.profile = profile;
        model.type = OrganizationMemberType.ContactPerson;
        model.organization = await this.organizationRepo.create({
            name: dto.organizationName,
            status: ApprovalType.New,
        });

        const saved = await this.organizationMemberRepo.save(model);

        if (saved?.id) {
            await this.SendOrganizationCreatedNotification(
                dto,
                pwdGenerated,
                saved,
            );
            return saved;
        }
        return saved;
    }

    private SendOrganizationCreatedNotification(
        dto: CreateOrganizationUserDto,
        pwdGenerated: string,
        saved: OrganizationMembers,
    ) {
        return null;
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
            const memberList = await this.findMembers(orgId);
            const profileIds = [];
            const users = [];

            for (const member of memberList) {
                profileIds.push(member.profile.id);
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
        });

        if (!update) {
            throw new EntityNotFoundException('Organization');
        }

        const ordUpdated = await this.organizationRepo.save(update);

        if (ordUpdated) {
            if (note) {
                await this.notesService.create(
                    orgId,
                    note,
                    'Organization Active/Inactive status',
                );
            }
            return UtilityServices.SuccessDataResponse();
        }
        throw new BadRequestException('Unable to update');
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

    updateOrganizationLocation(orgId: string, location: LocationModel) {
        return this.addressService.createLocation(
            location,
            orgId,
            ReferenceType.Organization,
        );
    }

    async uploadLogo(organizationId: string, file: Express.Multer.File) {
        const documentId = await this.documentService.create(
            file,
            organizationId,
        );

        const updated = await this.organizationRepo.update(
            { id: organizationId },
            { logo: documentId },
        );

        return UtilityServices.EnsureUpdated(updated, organizationId);
    }
}

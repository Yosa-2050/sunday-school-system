import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/request/create-organization.dto';
import { UpdateOrganizationDto } from './dto/request/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { EmployeesService } from './employees.service';
import { EmployeeOrganization } from './entities/employee-organization.entity';
import { AssignEmployeeRequestDto } from './dto/request/assign-security-person.request.dto';
import { AddressService } from 'src/location/address.service';
import { ReferenceType } from 'src/Utilities/enums/reference-type.enum';
import { AddOrganizationBranchDto } from './dto/request/add-branch.dto';
import { UserRoleType } from 'src/users/enums/user-role.enum';

@Injectable()
export class OrganizationService {
  
  
  constructor(
    @InjectRepository(Organization) private organizationRepo: Repository<Organization>,
    @InjectRepository(EmployeeOrganization) private employeeOrgRepo: Repository<EmployeeOrganization>,
    @InjectRepository(Branch) private branchRepo: Repository<Branch>,
    @Inject(EmployeesService) private employeeService: EmployeesService,
    private addressService: AddressService
  ) {}

  async create(request: CreateOrganizationDto) {
    var organization = this.organizationRepo.create(request);
    organization.branches = []; 
    const branches = await organization.branches;

    var branch = this.branchRepo.create();
    branch.name = request.mainBranchName ?? "Main Branch";
    branch.isMainBranch = true;
    branches.push(branch);

    var org = await this.organizationRepo.save(organization);
    this.addressService.createContactDetails(request.contactDetails, org.id, ReferenceType.Organization);
    return org;
  }

  async addBranch(request: AddOrganizationBranchDto, orgId: string) {
    var org = await this.organizationRepo.findOneBy({id:orgId});
    if(!org) throw new NotFoundException("Organization not found");
    var branch =this.branchRepo.create();
    branch.name = request.branchName;
    branch.isMainBranch = false;
    branch.organization = org;

    var saved = await this.branchRepo.save(branch);
    this.addressService.createContactDetails(request.contactDetails, saved.id, ReferenceType.Branch);
    return saved;
  }


  findAll() {
    return this.organizationRepo.findBy({isActive: true, deletedAt: null});
  }

  async findOne(id: string) {
    var organization =  await this.organizationRepo.findOneBy({id: id});
    if(!organization) throw new NotFoundException("Organization not found");
    var contactDetails = await this.addressService.getContanctByRefernce(organization.id, ReferenceType.Organization);
    var location = await this.addressService.getLocationByRefernce(organization.id, ReferenceType.Organization);
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
    const assignEmployee = await this.employeeOrgRepo.findOneBy({employee: {id: request.employeeId}, isActive: true});
    if(assignEmployee) {throw new BadRequestException("Employee already assigned to an organization")};
    var branch = null;
    if(request.branchId){
      var branches = await org?.branches; 
      branch = branches?.find(x => x.id === request.branchId);
      if(!branch){
        throw new BadRequestException("Branch not found");
      }
    };

    const person = this.employeeOrgRepo.create();
    person.organization = org;
    person.employee = employee;
    person.branch = branch;
    person.type = request.type;

    return this.employeeOrgRepo.save(person);
  }

  findEmployee(id: string) {
    return this.employeeOrgRepo.findBy({organization: {id}, isActive: true});
  }

  findAssignedEmployeeByEmployeeId(id: string) {
    return this.employeeOrgRepo.findOneBy({employee: {id}, isActive: true});
  }

  findAssignedEmployeeById(id: string) {
    return this.employeeOrgRepo.findOneBy({id})
  }

  findBranches(orgId: string) {
    return this.branchRepo.findBy({organization: {id: orgId}, isActive: true});
  }


  async getOrganizationDetail(profileId: string){
      var employee = await this.employeeService.getEmployeeByProfileId(profileId);
      //assumpiton Employee only have one active org assignment
      var assignEmployee = await this.findAssignedEmployeeByEmployeeId(employee.id);
      var organization = await assignEmployee?.organization;
      var branch = await assignEmployee?.branch;

      return {
        employeeId: employee?.id,
        assignedEmployeeId: assignEmployee?.id,
        organizationId: organization?.id,
        branchId: branch?.id
      };
  }

}

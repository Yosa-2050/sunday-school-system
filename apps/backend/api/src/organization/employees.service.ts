import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfileService } from "src/users/profile.service";
import {
  validateEmployeeRole,
} from "src/users/enums/user-role.enum";
import { Repository } from "typeorm";
import { CreateEmployeeDto } from "./dto/request/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/request/update-employee.dto";
import { Employee } from "./entities/employee.entity";
import { AddressService } from "src/location/address.service";
import { ReferenceType } from "src/Utilities/enums/reference-type.enum";

@Injectable()
export class EmployeesService {
  
  constructor(
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    private profileService: ProfileService,
    private addressService: AddressService,
  ) {}

  async CreateEmployee(
    dto: CreateEmployeeDto
  ) {
    if (!validateEmployeeRole(dto.role))
      throw new BadRequestException("This Role Can Not Be Created");

    var profile = await this.profileService.createNewUserProfile(
      dto.email,
      dto.password,
      dto.role,
      dto.profile_dto,
      null,
      false
    );

    const model = this.employeeRepo.create();
    model.profile = profile;
    var employee = await this.employeeRepo.save(model);
    this.addressService.createContactDetails(dto.contactDetails, employee.profile.id, ReferenceType.Profile);
    return profile;
  }

  findAll() {
    return this.employeeRepo.find();
  }

  async findOne(id: string) {
    var employee = await this.employeeRepo.findOneBy({id});
    if(employee) return employee;
    throw new NotFoundException("Employee not found");
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
    return this.employeeRepo.findOneBy({profile: {id: profileId}, isActive: true});
  }
}

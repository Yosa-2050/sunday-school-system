import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundException } from "@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception";
import { PasswordService } from "@shega/Utilities/password.service";
import { parseExcel } from "@shega/Utilities/service/parse-excel.service";
import { UtilityServices } from "@shega/Utilities/service/utility.services";
import { NotificationChannel } from "@shega/notification/enums/notification-channel.enum";
import { NotificationType } from "@shega/notification/enums/notification-type.enum";
import { NotificationService } from "@shega/notification/notification.service";
import { LoginBy } from "@shega/users/enums/login-by.enum";
import { UserRoleType } from "@shega/users/enums/user-role.enum";
import { ProfileService } from "@shega/users/profile.service";
import { Express } from "express";
import { In, Repository } from "typeorm";
import { CreateStudentRequestDto } from "../dto/request/create-student.request.dto";
import { ImportStudentsRequest } from "../dto/request/import-student.request.dto";
import {
  PaginatedStudentResponseDto,
  StudentResponseDto,
} from "../dto/response/student.response.dto";
import { Classes } from "../entities/classes.entity";
import { Students } from "../entities/students.entity";
import { ClassService } from "./class.service";
import { PaginationDto } from "@shega/Utilities/models/paginated.request";

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Classes) private classRepo: Repository<Classes>,
    @InjectRepository(Students) private studentRepo: Repository<Students>,
    private classService: ClassService,
    private passwordService: PasswordService,
    private profileService: ProfileService,
    private notificationService: NotificationService,
  ) {}

  async CreateStudentDetailed(
    classId: string,
    dto: CreateStudentRequestDto,
    yearId: string,
  ) {
    const valid = await this.classService.isClassValid(classId, yearId);
    if (!valid) {
      throw new EntityNotFoundException(typeof Classes);
    }
    const pwdGenerated = this.passwordService.generatePassword();
    const profile = await this.profileService.createNewUserProfileQDE(
      dto.email,
      LoginBy.EMAIL,
      UserRoleType.Student,
      dto.firstName,
      dto.middleName,
      dto.lastName,
      dto.phoneNumber,
      dto.gender,
      dto.birthDate,
      dto.baptistName,
      false,
      pwdGenerated,
      true,
    );

    const model = this.studentRepo.create();
    model.profile = profile;
    model.idNumber = dto.idNumber;
    model.class = valid;
    const saved = await this.studentRepo.save(model);
    return saved;
  }

  async findStudents(classId: string, yearId: string) {
    const valid = await this.classService.isClassValid(classId, yearId);
    if (!valid) {
      throw new EntityNotFoundException(typeof Classes);
    }
    const students = await valid.students;
    return students.map((x) => {
      return new StudentResponseDto(x);
    });
  }

  async findStudentsPaginated(
    classId: string,
    yearId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedStudentResponseDto> {
    const valid = await this.classService.isClassValid(classId, yearId);

    if (!valid) {
      throw new EntityNotFoundException(typeof Classes);
    }

    const queryBuilder = this.studentRepo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.profile", "profile")
      .leftJoinAndSelect("profile.user", "user")
      .where("student.classId = :classId", { classId });

    if (pagination.search) {
      const search = `%${pagination.search}%`;
      queryBuilder.andWhere(
        `(profile.firstName ILIKE :search 
        OR profile.middleName ILIKE :search 
        OR profile.lastName ILIKE :search 
        OR user.email ILIKE :search)`,
        { search },
      );
    }


    if (pagination.status && pagination.status !== "All") {
      if (pagination.status === "Active") {
        queryBuilder.andWhere("student.isActive = true");
      } else if (pagination.status === "InActive") {
        queryBuilder.andWhere("student.isActive = false");
      }
    }

    queryBuilder
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .orderBy("student.createdAt", "DESC");

    const [items, total] = await queryBuilder.getManyAndCount();

    const data = items.map((x) => new StudentResponseDto(x));

    return new PaginatedStudentResponseDto(
      data,
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async importStudents(
    file: Express.Multer.File,
    classId: string,
    yearId: string,
  ) {
    const valid = await this.classService.isClassValid(classId, yearId);
    if (!valid) {
      throw new EntityNotFoundException(typeof Classes);
    }
    const excel = parseExcel(file.buffer, ImportStudentsRequest);
    return this.saveImportedStudents(excel, valid);
  }

  async previewImportedStudents(file: Express.Multer.File) {
    const excel = parseExcel(file.buffer, ImportStudentsRequest);
    const errors = this.validateImportedStudents(excel);

    if (errors.length > 0) {
      throw new BadRequestException({ message: "Validation failed", errors });
    }

    return excel;
  }

  async importStudentsFromData(
    data: ImportStudentsRequest[],
    classId: string,
    yearId: string,
  ) {
    const valid = await this.classService.isClassValid(classId, yearId);
    if (!valid) {
      throw new EntityNotFoundException(typeof Classes);
    }

    return this.saveImportedStudents(data, valid);
  }

  private validateImportedStudents(data: ImportStudentsRequest[]) {
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const dto = data[i];
      if (!dto.FirstName?.trim()) {
        errors.push(`Row ${i + 2}: First Name is required`);
      }
      if (!dto.MiddleName?.trim()) {
        errors.push(`Row ${i + 2}: Middle Name is required`);
      }
      if (!dto.EmergencyContact?.trim()) {
        errors.push(`Row ${i + 2}: Emergency Contact Name is required`);
      }
    }

    return errors;
  }

  private async saveImportedStudents(
    data: ImportStudentsRequest[],
    valid: Classes,
  ) {
    const errors = this.validateImportedStudents(data);
    if (errors.length > 0) {
      throw new BadRequestException({ message: "Validation failed", errors });
    }

    const models = [];
    for (let index = 0; index < data.length; index++) {
      const dto = data[index];
      const pwdGenerated = this.passwordService.generatePassword();
      const profile = await this.profileService.createNewUserProfileQDE(
        dto.IdNumber,
        LoginBy.USERNAME,
        UserRoleType.Student,
        dto.FirstName,
        dto.MiddleName,
        dto.LastName,
        dto.PhoneNumber,
        dto.Gender,
        dto.BirthDate,
        dto.ChristianName,
        false,
        pwdGenerated,
        true,
      );

      const relative = await this.profileService.createProfileQDE(
        dto.EmergencyContact,
        "",
        "",
        dto.EmergencyContactPhone,
      );
      const relationship = await this.profileService.createRelationShips(
        profile,
        relative,
        dto.RelationshipType,
        true,
        false,
      );
      profile.relation = [];
      profile.relation.push(relationship);

      const model = this.studentRepo.create();
      model.profile = profile;
      model.idNumber = dto.IdNumber;
      model.class = valid;
      models.push(model);
    }

    if (models.length > 0) {
      await this.studentRepo.save(models);
      return UtilityServices.SuccessDataResponse();
    }

    throw new BadRequestException("Nothing to upload");
  }


  async findStudentsById(id: string) {
    const student = await this.studentRepo.findOneBy({ id });
    if (student) {
      const classes = await this.classRepo.findOneBy({
        id: student.class.id,
      });
      if (classes?.isSection) {
        const parent = await classes.parent;
        student.class.name = `${parent.name} - ${classes.name}`;
      }
    }
    return student;
  }

  async findStudentsByClassId(id: string, classId: string) {
    const student = await this.studentRepo.findOneBy({
      id,
      class: { id: classId },
    });
    return student;
  }

  async sendNotificationForAllStudent(
    text: string,
    classId: string,
    studentsId: string[],
    type: number,
  ) {
    let students: Students[];
    if (type === 0) {
      //For class
      students = await this.studentRepo.findBy({
        isActive: true,
        class: { id: classId },
      });
    } else if (type === 1) {
      //For selected
      students = await this.studentRepo.findBy({
        isActive: true,
        id: In(studentsId),
      });
    } else {
      //TODO: this should be to only selected students on organization for active year
      //students = await this.studentRepo.findBy({ isActive: true });
    }
    for (let index = 0; index < students.length; index++) {
      const student = students[index];
      const email = (
        await this.profileService.findUserByProfileId(student.profile.id)
      )?.email;
      if (email) {
        this.notificationService.send({
          to: email,
          channel: NotificationChannel.Email,
          subject: "Test",
          content: text,
          reference: student.id,
          type: NotificationType.User,
          metaData: null,
        });
      }
    }
    return UtilityServices.SuccessDataResponse();
  }
}

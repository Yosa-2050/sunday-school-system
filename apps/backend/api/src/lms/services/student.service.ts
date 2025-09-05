import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { PasswordService } from '@shega/Utilities/password.service';
import { parseExcel } from '@shega/Utilities/service/parse-excel.service';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { LoginBy } from '@shega/users/enums/login-by.enum';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Express } from 'express';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateStudentRequestDto } from '../dto/request/create-student.request.dto';
import { ImportStudentsRequest } from '../dto/request/import-student.request.dto';
import { StudentResponseDto } from '../dto/response/student.response.dto';
import { Classes } from '../entities/classes.entity';
import { Students } from '../entities/students.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassService } from './class.service';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Classes) private classRepo: Repository<Classes>,
        @InjectRepository(Students) private studentRepo: Repository<Students>,
        private classService: ClassService,
        private passwordService: PasswordService,
        private profileService: ProfileService,
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
            dto.idNumber,
            LoginBy.USERNAME,
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
        const models = [];
        for (let index = 0; index < excel.length; index++) {
            const dto = excel[index];
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
                '',
                '',
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
        throw new BadRequestException('Nothing to upload');
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
}

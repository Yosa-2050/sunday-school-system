import { Injectable } from '@nestjs/common';
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

    async CreateStudentDetailed(dto: CreateStudentRequestDto) {
        const valid = await this.classService.isClassValid(dto.classId);
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

    async findStudents(classId: string) {
        const valid = await this.classService.isClassValid(classId);
        if (!valid) {
            throw new EntityNotFoundException(typeof Classes);
        }
        return await valid.students;
    }

    async importStudents(file: Express.Multer.File, classId: string) {
        const valid = await this.classService.isClassValid(classId);
        if (!valid) {
            throw new EntityNotFoundException(typeof Classes);
        }
        const excel = parseExcel(file.buffer, ImportStudentsRequest);
        for (let index = 0; index < excel.length; index++) {
            const dto = excel[index];
            const pwdGenerated = this.passwordService.generatePassword();
            const profile = await this.profileService.createNewUserProfileQDE(
                dto.IdNumber,
                LoginBy.USERNAME,
                UserRoleType.Student,
                dto.FirstName,
                dto.MiddleName,
                dto.lastName,
                dto.phoneNumber,
                false,
                pwdGenerated,
                true,
            );

            const relative = await this.profileService.createProfileQDE(
                dto.emergencyContact,
                '',
                '',
                dto.emergencyContactPhone,
            );
            const relationship = await this.profileService.createRelationShips(
                profile,
                relative,
                dto.relationShipType,
                true,
                false,
            );
            profile.relation.push(relationship);

            const model = this.studentRepo.create();
            model.profile = profile;
            model.idNumber = dto.IdNumber;
            model.class = valid;
            const saved = await this.studentRepo.save(model);
        }
        return UtilityServices.SuccessDataResponse();
    }
}

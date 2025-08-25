import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { PasswordService } from '@shega/Utilities/password.service';
import { LoginBy } from '@shega/users/enums/login-by.enum';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateStudentRequestDto } from '../dto/request/create-student.request.dto';
import { Classes } from '../entities/classes.entity';
// biome-ignore lint/style/useImportType: <explanation>
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
}

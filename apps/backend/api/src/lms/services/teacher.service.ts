import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateEmployeeDto } from '@shega/organization/dto/request/create-employee.dto';
import { LoginBy } from '@shega/users/enums/login-by.enum';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
import { Classes } from '../entities/classes.entity';
import { Teacher } from '../entities/teacher.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassService } from './class.service';
// biome-ignore lint/style/useImportType: <explanation>
import { LmsService } from './lms.service';

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Classes) private classRepo: Repository<Classes>,
        @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
        private classService: ClassService,
        private profileService: ProfileService,
        private lmsService: LmsService,
    ) {}

    async CreateTeacher(dto: CreateEmployeeDto, yearId: string) {
        const cYear = await this.lmsService.calendarYearById(yearId);

        const profile = await this.profileService.createNewUserProfileQDE(
            dto.email,
            LoginBy.EMAIL,
            UserRoleType.Teacher,
            dto.profile_dto.firstName,
            dto.profile_dto.middleName,
            dto.profile_dto.lastName,
            dto.profile_dto.phoneNumber,
            dto.profile_dto.gender,
            dto.profile_dto.birthDate,
            dto.profile_dto.baptistName,
            false,
            dto.password,
            true,
        );

        const model = this.teacherRepo.create();
        model.profile = profile;
        model.year = cYear;
        const saved = await this.teacherRepo.save(model);
        return saved;
    }

    findTeachers(yearId: string) {
        return this.teacherRepo.findBy({
            year: { id: yearId },
            isActive: true,
        });
    }

    findTeacherById(id: string, yearId: string) {
        return this.teacherRepo.findOneBy({ id, year: { id: yearId } });
    }
}
